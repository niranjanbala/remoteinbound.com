const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

class InboundSessionExtractor {
  constructor() {
    this.browser = null;
    this.page = null;
    this.sessions = [];
    this.speakers = new Map(); // To avoid duplicate speakers
  }

  async initialize() {
    console.log('🚀 Initializing browser...');
    this.browser = await puppeteer.launch({
      headless: true, // Set back to headless for production
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1200, height: 800 });
    
    // Setup database schema
    await this.setupSchema();
  }

  async setupSchema() {
    console.log('🗄️ Setting up database schema...');
    
    try {
      // Create inbound_session_tags table
      const { error: tagsError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS inbound_session_tags (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
            tag_name VARCHAR(100) NOT NULL,
            tag_category VARCHAR(50),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      // Create inbound_session_speakers table
      const { error: speakersError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS inbound_session_speakers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
            speaker_id UUID REFERENCES speakers(id) ON DELETE CASCADE,
            speaker_order INTEGER DEFAULT 1,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(session_id, speaker_id)
          );
        `
      });
      
      console.log('✅ Schema setup completed (or tables already exist)');
    } catch (error) {
      console.warn('⚠️ Schema setup failed, continuing anyway:', error.message);
    }
  }

  async extractSessions() {
    console.log('📄 Navigating to Inbound sessions page...');
    await this.page.goto('https://www.inbound.com/sessions', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Take a screenshot for debugging
    await this.page.screenshot({ path: 'debug-page-load.png', fullPage: true });
    console.log('📸 Screenshot saved as debug-page-load.png');

    // Accept cookies if present
    await this.acceptCookies();

    // Wait for sessions grid to load
    await this.waitForSessionsGrid();

    // Extract sessions from all pages
    await this.extractAllPages();

    console.log(`✅ Extracted ${this.sessions.length} sessions total`);
    return this.sessions;
  }

  async acceptCookies() {
    try {
      const cookieButtons = await this.page.$$('button');
      for (const button of cookieButtons) {
        const text = await this.page.evaluate(el => el.textContent, button);
        if (text && text.toLowerCase().includes('accept')) {
          await button.click();
          console.log('✅ Accepted cookies');
          break;
        }
      }
    } catch (e) {
      console.log('ℹ️ No cookie banner found');
    }
  }

  async waitForSessionsGrid() {
    console.log('⏳ Waiting for sessions grid to load...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    try {
      await this.page.waitForSelector('div.sessions-grid', { timeout: 15000 });
      console.log('✅ Found sessions grid');
    } catch (e) {
      console.log('⚠️ Sessions grid not found, continuing anyway...');
    }
  }

  async extractAllPages() {
    let currentPage = 1;
    let hasMorePages = true;
    let totalExpected = 0;

    while (hasMorePages && currentPage <= 20) { // Safety limit of 20 pages
      console.log(`🔍 Extracting sessions from page ${currentPage}...`);
      
      // Scroll to load all sessions on current page
      await this.autoScroll();
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Extract sessions from current page
      const pageSessionData = await this.extractCurrentPageSessions();
      
      // Get total count from first page
      if (currentPage === 1) {
        totalExpected = await this.page.evaluate(() => {
          const gridEl = document.querySelector('.sessions-grid');
          if (gridEl) {
            const resultsText = gridEl.getAttribute('results_count') || '';
            const match = resultsText.match(/of (\d+) Results/);
            return match ? parseInt(match[1]) : 0;
          }
          return 0;
        });
        console.log(`📊 Total sessions expected: ${totalExpected}`);
      }
      
      if (pageSessionData.length > 0) {
        this.sessions.push(...pageSessionData);
        console.log(`✅ Extracted ${pageSessionData.length} sessions from page ${currentPage} (Total so far: ${this.sessions.length}/${totalExpected})`);
      } else {
        console.log(`ℹ️ No sessions found on page ${currentPage}`);
      }

      // Check if we have all sessions or if we should continue
      if (totalExpected > 0 && this.sessions.length >= totalExpected) {
        console.log(`🎯 Reached expected total of ${totalExpected} sessions`);
        break;
      }

      // Check for next page and navigate if exists
      hasMorePages = await this.navigateToNextPage();
      if (hasMorePages) {
        currentPage++;
        // Wait for new page to load
        await new Promise(resolve => setTimeout(resolve, 5000)); // Longer wait
      }
    }
    
    console.log(`📈 Final extraction summary: ${this.sessions.length} sessions extracted from ${currentPage} pages`);
  }

  async extractCurrentPageSessions() {
    // Enable console logging from the page
    this.page.on('console', msg => {
      if (msg.type() === 'log') {
        console.log('🌐 Browser:', msg.text());
      }
    });

    return await this.page.evaluate(() => {
      const sessions = [];
      
      // Debug: Log page content structure
      console.log('Page title:', document.title);
      console.log('Page URL:', window.location.href);
      
      // Look for the sessions grid
      const sessionsGrid = document.querySelector('div.sessions-grid');
      console.log('Sessions grid found:', !!sessionsGrid);
      
      if (!sessionsGrid) {
        console.log('No sessions-grid found, looking for alternative structures...');
        const allDivs = document.querySelectorAll('div[class*="session"]');
        console.log(`Found ${allDivs.length} divs with "session" in class name`);
        
        // Try to find any grid-like structures
        const grids = document.querySelectorAll('div[class*="grid"], ul, ol');
        console.log(`Found ${grids.length} potential grid structures`);
        
        return [];
      }
      
      // Debug: Log sessions grid content
      console.log('Sessions grid HTML (first 500 chars):', sessionsGrid.outerHTML.substring(0, 500));
      console.log('Sessions grid children count:', sessionsGrid.children.length);
      
      // Look for the ul inside sessions-grid
      const sessionsList = sessionsGrid.querySelector('ul');
      console.log('Sessions list (ul) found:', !!sessionsList);
      
      if (!sessionsList) {
        console.log('No ul found in sessions-grid, looking for other child elements...');
        
        // Try to find any list-like structures in the grid
        const allLists = sessionsGrid.querySelectorAll('ul, ol, div[class*="list"]');
        console.log(`Found ${allLists.length} list structures in sessions-grid`);
        
        // Try to find direct children that might be session containers
        const directChildren = Array.from(sessionsGrid.children);
        console.log(`Sessions grid has ${directChildren.length} direct children`);
        
        directChildren.forEach((child, index) => {
          console.log(`Child ${index}: ${child.tagName} with classes: ${child.className}`);
        });
        
        return [];
      }
      
      // Debug: Log ul content
      console.log('Sessions list HTML (first 500 chars):', sessionsList.outerHTML.substring(0, 500));
      
      // Get all li elements (each represents a session)
      const sessionElements = sessionsList.querySelectorAll('li');
      console.log(`Found ${sessionElements.length} session li elements`);
      
      // If no li elements, try other child elements
      if (sessionElements.length === 0) {
        const allChildren = sessionsList.querySelectorAll('*');
        console.log(`Sessions list has ${allChildren.length} total child elements`);
        
        const directListChildren = Array.from(sessionsList.children);
        console.log(`Sessions list has ${directListChildren.length} direct children`);
        
        directListChildren.forEach((child, index) => {
          console.log(`List child ${index}: ${child.tagName} with classes: ${child.className}`);
          console.log(`Content preview: ${child.textContent.substring(0, 100)}`);
        });
      }

      sessionElements.forEach((element, index) => {
        try {
          // Extract session title - try multiple approaches
          let title = '';
          
          // Try h3 first
          const h3El = element.querySelector('h3');
          if (h3El && h3El.textContent.trim()) {
            title = h3El.textContent.trim();
          }
          
          // Try other heading elements
          if (!title) {
            const headingEl = element.querySelector('h1, h2, h4, h5, h6');
            if (headingEl && headingEl.textContent.trim()) {
              title = headingEl.textContent.trim();
            }
          }
          
          // Try elements with title-like classes
          if (!title) {
            const titleEl = element.querySelector('[class*="title"], [class*="heading"], [class*="name"]');
            if (titleEl && titleEl.textContent.trim()) {
              title = titleEl.textContent.trim();
            }
          }
          
          // Try any link text that might be a title
          if (!title) {
            const linkEl = element.querySelector('a');
            if (linkEl && linkEl.textContent.trim() && linkEl.textContent.trim().length > 10) {
              title = linkEl.textContent.trim();
            }
          }
          
          // If still no title, try to extract from any text content
          if (!title) {
            const textContent = element.textContent.trim();
            // Look for text that looks like a title (not just time or single words)
            const lines = textContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            for (const line of lines) {
              // Skip lines that look like time, single words, or very short text
              if (line.length > 15 && !line.includes('•') && !line.includes('am') && !line.includes('pm')) {
                title = line;
                break;
              }
            }
          }

          if (!title) {
            console.log(`Session ${index}: No title found, raw content:`, element.textContent.substring(0, 200));
            // Don't skip - create a placeholder title
            title = `Session ${index + 1}`;
          }

          console.log(`Session ${index}: Found title "${title}"`);

          // Extract date and time from p.time
          const timeEl = element.querySelector('p.time');
          const timeText = timeEl ? timeEl.textContent.replace(/<!--.*?-->/g, '').trim() : '';
          
          console.log(`Session ${index}: Time text "${timeText}"`);

          // Extract speakers from speaker images
          const speakers = [];
          const speakerImgs = element.querySelectorAll('.speaker-imgs img, .speakers img');
          speakerImgs.forEach(img => {
            const name = img.alt || img.getAttribute('title') || '';
            const avatar = img.src || img.getAttribute('data-src') || '';
            
            if (name && name.length > 2) {
              speakers.push({
                name: name.trim(),
                avatar: avatar
              });
            }
          });

          // Also try to get speaker names from links
          const speakerLinks = element.querySelectorAll('.speakers a[href*="/speakers/"]');
          speakerLinks.forEach(link => {
            const name = link.textContent.trim();
            if (name && name.length > 2) {
              // Check if we already have this speaker
              const exists = speakers.some(s => s.name === name);
              if (!exists) {
                speakers.push({
                  name: name,
                  avatar: ''
                });
              }
            }
          });

          console.log(`Session ${index}: Found ${speakers.length} speakers`);

          // Extract tags from various elements
          const tags = [];
          
          // Look for tag-like elements
          const tagElements = element.querySelectorAll('.tag, .badge, .chip, .category, [class*="tag"]');
          tagElements.forEach(tagEl => {
            const tagText = tagEl.textContent.trim().toUpperCase();
            if (tagText && tagText.length > 1 && !tags.includes(tagText)) {
              tags.push(tagText);
            }
          });

          // Extract level and reservation info
          const reservationEl = element.querySelector('.required-reservation, [class*="reservation"]');
          const reservationRequired = !!reservationEl || element.textContent.includes('Reservation Required');
          
          const levelEl = element.querySelector('[class*="level"]');
          let level = 'OPEN TO ALL LEVELS';
          if (levelEl) {
            level = levelEl.textContent.trim();
          } else if (element.textContent.includes('ADVANCED')) {
            level = 'ADVANCED';
          }

          // Extract sponsor info
          let sponsor = null;
          const sponsorEl = element.querySelector('[class*="sponsor"], [class*="partner"]');
          if (sponsorEl) {
            const sponsorImg = sponsorEl.querySelector('img');
            sponsor = {
              name: sponsorEl.textContent.trim() || sponsorImg?.alt || '',
              logo: sponsorImg?.src || sponsorImg?.getAttribute('data-src') || ''
            };
          }

          const sessionData = {
            title,
            timeText,
            speakers,
            tags,
            level,
            reservationRequired,
            sponsor,
            rawHtml: element.outerHTML.substring(0, 500) // For debugging
          };

          console.log(`Session ${index}: Extracted data:`, JSON.stringify(sessionData, null, 2));
          sessions.push(sessionData);

        } catch (error) {
          console.error(`Error extracting session ${index}:`, error);
        }
      });

      return sessions;
    });
  }

  async navigateToNextPage() {
    try {
      // Look for pagination controls with valid selectors
      const nextButtons = await this.page.$$('button, a');
      
      for (const button of nextButtons) {
        const text = await this.page.evaluate(el => el.textContent?.toLowerCase() || '', button);
        const ariaLabel = await this.page.evaluate(el => el.getAttribute('aria-label')?.toLowerCase() || '', button);
        
        if (text.includes('next') || ariaLabel.includes('next page')) {
          const isDisabled = await this.page.evaluate(btn => {
            return btn.disabled || btn.classList.contains('disabled') || btn.getAttribute('aria-disabled') === 'true';
          }, button);
          
          if (!isDisabled) {
            console.log('🔄 Navigating to next page...');
            await button.click();
            await new Promise(resolve => setTimeout(resolve, 3000));
            return true;
          }
        }
      }
      
      console.log('ℹ️ No more pages found');
      return false;
    } catch (error) {
      console.log('ℹ️ Pagination navigation failed or no more pages:', error.message);
      return false;
    }
  }

  async autoScroll() {
    await this.page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }

  parseDateTime(timeText) {
    if (!timeText) return null;

    try {
      // Clean up the text by removing Vue.js comments and extra spaces
      const cleanText = timeText
        .replace(/<!--.*?-->/g, '') // Remove Vue.js comments
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();

      console.log('Parsing cleaned time text:', cleanText);

      // Parse format like "Wed • Sep 3 • 10:45am - 11:15am PT •"
      const parts = cleanText.split('•').map(p => p.trim()).filter(p => p.length > 0);
      
      if (parts.length >= 3) {
        const datePart = parts[1]; // "Sep 3"
        const timePart = parts[2]; // "10:45am - 11:15am PT"
        
        // Handle time range
        const timeRange = timePart.replace(' PT', '').trim();
        const [startTime, endTime] = timeRange.split(' - ').map(t => t.trim());
        
        const year = new Date().getFullYear();
        
        // Create date objects (assuming current year)
        const startDateTime = new Date(`${datePart} ${year} ${startTime}`);
        const endDateTime = new Date(`${datePart} ${year} ${endTime}`);
        
        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
          console.warn('Invalid date created from:', datePart, startTime, endTime);
          return null;
        }
        
        return {
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString()
        };
      }
    } catch (error) {
      console.warn('Could not parse date/time:', timeText, error.message);
    }
    
    return null;
  }

  async storeSessions() {
    console.log('💾 Storing sessions in Supabase...');
    
    for (const sessionData of this.sessions) {
      try {
        // Parse date/time
        const dateTime = this.parseDateTime(sessionData.timeText);
        
        // Create or get speakers
        const speakerIds = [];
        for (const speakerData of sessionData.speakers) {
          const speakerId = await this.createOrGetSpeaker(speakerData);
          if (speakerId) speakerIds.push(speakerId);
        }

        // Create session with basic fields first
        const basicSessionPayload = {
          title: sessionData.title,
          description: sessionData.title, // Using title as description for now
          start_time: dateTime?.start_time || new Date().toISOString(),
          end_time: dateTime?.end_time || new Date(Date.now() + 3600000).toISOString(),
          speaker_ids: speakerIds, // Use existing field
          tags: sessionData.tags
        };

        // Store level and sponsor info in description for now
        const description = [
          sessionData.title,
          sessionData.level ? `Level: ${sessionData.level}` : '',
          sessionData.sponsor?.name ? `Sponsor: ${sessionData.sponsor.name}` : ''
        ].filter(Boolean).join(' | ');
        
        basicSessionPayload.description = description;

        const { data: session, error: sessionError } = await supabase
          .from('sessions')
          .insert(basicSessionPayload)
          .select()
          .single();

        if (sessionError) {
          console.error('Error creating session:', sessionError);
          continue;
        }

        console.log(`✅ Created/updated session: ${session.title}`);

        // Link speakers to session (try junction table, fallback to speaker_ids array)
        if (speakerIds.length > 0) {
          try {
            for (const speakerId of speakerIds) {
              await supabase
                .from('inbound_session_speakers')
                .upsert({
                  session_id: session.id,
                  speaker_id: speakerId
                }, { onConflict: 'session_id,speaker_id' });
            }
            console.log(`✅ Linked ${speakerIds.length} speakers to session`);
          } catch (error) {
            console.warn('Junction table not available, speakers stored in speaker_ids array');
          }
        }

        // Add tags (try junction table, fallback to tags array)
        if (sessionData.tags.length > 0) {
          try {
            for (const tag of sessionData.tags) {
              await supabase
                .from('inbound_session_tags')
                .upsert({
                  session_id: session.id,
                  tag_name: tag,
                  tag_category: 'topic'
                }, { onConflict: 'session_id,tag_name' });
            }
            console.log(`✅ Added ${sessionData.tags.length} tags to session`);
          } catch (error) {
            console.warn('Tags junction table not available, tags stored in session tags array');
          }
        }

      } catch (error) {
        console.error('Error storing session:', sessionData.title, error);
      }
    }

    console.log('✅ All sessions stored successfully!');
  }

  async createOrGetSpeaker(speakerData) {
    if (!speakerData.name) return null;
    
    // Check if speaker already exists by name
    const { data: existingSpeaker } = await supabase
      .from('speakers')
      .select('id')
      .eq('name', speakerData.name)
      .single();

    if (existingSpeaker) {
      return existingSpeaker.id;
    }

    // Create new speaker with basic fields
    const speakerPayload = {
      name: speakerData.name,
      title: 'Speaker', // Default title
      company: 'Inbound', // Default company
      bio: `Speaker at Inbound conference`,
      avatar: speakerData.avatar
    };

    const { data: newSpeaker, error } = await supabase
      .from('speakers')
      .insert(speakerPayload)
      .select()
      .single();

    if (error) {
      console.error('Error creating speaker:', error);
      return null;
    }

    console.log(`✅ Created speaker: ${newSpeaker.name}`);
    return newSpeaker.id;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      await this.initialize();
      const sessions = await this.extractSessions();
      await this.storeSessions();
      
      console.log('🎉 Extraction completed successfully!');
      console.log(`📊 Total sessions extracted: ${this.sessions.length}`);
      
    } catch (error) {
      console.error('❌ Extraction failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Run the extractor
if (require.main === module) {
  const extractor = new InboundSessionExtractor();
  extractor.run().catch(console.error);
}

module.exports = InboundSessionExtractor;
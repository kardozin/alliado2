// RSS Parser utility functions
export interface RSSItem {
  id: string;
  title: string;
  description: string;
  link: string;
  publishedAt: Date;
  content?: string;
}

export interface RSSFeed {
  id: string;
  feedUrl: string;
  feedName: string;
  posts: RSSItem[];
}

// Parse RSS XML to extract items
function parseRSSXML(xmlText: string, feedUrl: string): RSSItem[] {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML format');
    }

    const items: RSSItem[] = [];
    
    // Try RSS 2.0 format first
    let itemElements = xmlDoc.querySelectorAll('item');
    
    // If no items found, try Atom format
    if (itemElements.length === 0) {
      itemElements = xmlDoc.querySelectorAll('entry');
    }

    itemElements.forEach((item, index) => {
      try {
        // RSS 2.0 format
        let title = item.querySelector('title')?.textContent?.trim() || 'Sin título';
        let description = item.querySelector('description')?.textContent?.trim() || 
                         item.querySelector('summary')?.textContent?.trim() || 
                         'Sin descripción';
        let link = item.querySelector('link')?.textContent?.trim() || 
                  item.querySelector('link')?.getAttribute('href') || 
                  feedUrl;
        let pubDate = item.querySelector('pubDate')?.textContent?.trim() || 
                     item.querySelector('published')?.textContent?.trim() || 
                     item.querySelector('updated')?.textContent?.trim();

        // Clean up description (remove HTML tags and limit length)
        description = description.replace(/<[^>]*>/g, '').substring(0, 300);
        if (description.length === 300) {
          description += '...';
        }

        // Parse date
        let publishedAt = new Date();
        if (pubDate) {
          const parsedDate = new Date(pubDate);
          if (!isNaN(parsedDate.getTime())) {
            publishedAt = parsedDate;
          }
        }

        items.push({
          id: `${feedUrl}-${index}`,
          title,
          description,
          link,
          publishedAt
        });
      } catch (error) {
        console.warn('Error parsing RSS item:', error);
      }
    });

    return items.slice(0, 10); // Limit to 10 most recent items
  } catch (error) {
    console.error('Error parsing RSS XML:', error);
    throw new Error('Error al procesar el feed RSS');
  }
}

// Fetch RSS feed through CORS proxy
export async function fetchRSSFeed(feedUrl: string): Promise<RSSFeed> {
  try {
    // Use server-side function to fetch RSS feeds
    const response = await fetch('/api/fetch-rss', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feedUrl }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    const xmlText = data.contents;
    
    if (!xmlText) {
      throw new Error('No content received from RSS feed');
    }

    const posts = parseRSSXML(xmlText, feedUrl);
    
    // Extract feed name from URL or use domain
    let feedName = 'RSS Feed';
    try {
      const url = new URL(feedUrl);
      const domain = url.hostname.replace('www.', '');
      
      // Common feed name mappings
      if (domain.includes('megaphone.fm')) {
        feedName = 'Megaphone Podcast';
      } else if (domain.includes('techcrunch.com')) {
        feedName = 'TechCrunch';
      } else if (domain.includes('producthunt.com')) {
        feedName = 'Product Hunt';
      } else if (domain.includes('behance.net')) {
        feedName = 'Behance';
      } else if (domain.includes('medium.com')) {
        feedName = 'Medium';
      } else {
        feedName = domain.charAt(0).toUpperCase() + domain.slice(1);
      }
    } catch (error) {
      feedName = 'RSS Feed';
    }

    return {
      id: `feed-${Date.now()}`,
      feedUrl,
      feedName,
      posts
    };
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    throw new Error(`Error al cargar el feed RSS: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

// Fetch multiple RSS feeds
export async function fetchMultipleRSSFeeds(feedUrls: string[]): Promise<RSSFeed[]> {
  const results = await Promise.allSettled(
    feedUrls.map(url => fetchRSSFeed(url))
  );

  const successfulFeeds: RSSFeed[] = [];
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successfulFeeds.push(result.value);
    } else {
      errors.push(`Error en ${feedUrls[index]}: ${result.reason.message}`);
    }
  });

  if (errors.length > 0) {
    console.warn('RSS feed errors:', errors);
  }

  return successfulFeeds;
}
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getSpeakersFromProfiles, type ProfileSpeaker } from '@/app/actions/db/profiles/queries';

export interface FAQItem {
  id: number;
  question: string;
  content: string;
  contentHtml: string;
  slug: string;
}

// Simple function to convert basic markdown to HTML
function simpleMarkdownToHtml(content: string): string {
  // Split content into paragraphs (separated by double newlines)
  const paragraphs = content.split(/\n\n+/);
  
  return paragraphs
    .map(paragraph => {
      // Check if this paragraph is a list
      const lines = paragraph.trim().split('\n');
      const isAllListItems = lines.every(line => line.trim().startsWith('- ') || line.trim() === '');
      
      if (isAllListItems) {
        // Convert to HTML list
        const listItems = lines
          .filter(line => line.trim().startsWith('- '))
          .map(line => {
            let content = line.substring(2).trim();
            // Convert bold text
            content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            return `<li>${content}</li>`;
          })
          .join('\n');
        return `<ul>${listItems}</ul>`;
      } else {
        // Regular paragraph
        let processed = paragraph.trim();
        // Convert bold text
        processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Don't wrap empty strings in p tags
        if (!processed) return '';
        
        return `<p>${processed}</p>`;
      }
    })
    .filter(html => html !== '') // Remove empty elements
    .join('\n');
}

export async function getFAQs(): Promise<FAQItem[]> {
  const faqDirectory = path.join(process.cwd(), 'content', 'faq');
  const fileNames = fs.readdirSync(faqDirectory);
  
  const faqs = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(faqDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // Convert to simple HTML
      const contentHtml = simpleMarkdownToHtml(content);
      
      return {
        id: data.id,
        question: data.question,
        content,
        contentHtml,
        slug
      };
    });
  
  return faqs.sort((a, b) => a.id - b.id);
} 
export interface Partner {
  id: number;
  name: string;
  logo: string;
  logoSize?: string;
  wideLogo?: boolean;
  website?: string;
  type: "organizer" | "supporter" | "sponsor" | "media" | "drinks'n'bytes";
  tier?: "bronze" | "silver" | "gold" | "platinum";
  description?: string;
  tagline?: string;
  industry?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
}

export async function getPartners(filterFn?: (partner: Partner) => boolean): Promise<Partner[]> {
  const partnersDirectory = path.join(process.cwd(), 'content', 'partners');
  const fileNames = fs.readdirSync(partnersDirectory);
  
  const partners = fileNames
    .filter(fileName => fileName.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(partnersDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const data = JSON.parse(fileContents) as Partner;
      return data;
    });
  
  const sortedPartners = partners.sort((a, b) => a.id - b.id);
  
  return filterFn ? sortedPartners.filter(filterFn) : sortedPartners;
}

export async function getSponsors(): Promise<Partner[]> {
  return getPartners((partner) => partner.type === "sponsor");
}

export interface Speaker {
  id: string; // Changed from number to string to match Supabase UUID
  name: string;
  image: string;
  gameName: string;
  gameUrl: string;
  gameName2?: string;
  gameUrl2?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  slug: string;
}

// Convert ProfileSpeaker from Supabase to Speaker interface expected by components
function convertProfileToSpeaker(profile: ProfileSpeaker): Speaker {
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
  
  return {
    id: profile.id,
    name: fullName || 'Unknown Speaker',
    image: profile.profile_pictures_url || '',
    gameName: profile.site_name || '',
    gameUrl: profile.site_url || '',
    gameName2: profile.site_name_2 ?? undefined,
    gameUrl2: profile.site_url_2 ?? undefined,
    website: undefined,
    twitter: undefined,
    linkedin: undefined,
    github: undefined,
    slug: profile.id, // Use the UUID as slug
  };
}

export async function getSpeakers(): Promise<Speaker[]> {
  try {
    // Fetch from Supabase Profiles table
    const profiles = await getSpeakersFromProfiles();
    return profiles.map(convertProfileToSpeaker);
  } catch (error) {
    console.error('Error fetching speakers from Supabase, falling back to markdown files:', error);
    
    // Fallback to original markdown-based implementation
    const speakersDirectory = path.join(process.cwd(), 'content', 'speakers');
    
    // Check if directory exists
    if (!fs.existsSync(speakersDirectory)) {
      console.error('Speakers directory does not exist, returning empty array');
      return [];
    }
    
    const fileNames = fs.readdirSync(speakersDirectory);
    
    const speakers = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(speakersDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        
        // Convert to simple HTML
        const contentHtml = simpleMarkdownToHtml(content);
        
        return {
          id: data.id?.toString() || slug, // Convert to string
          name: data.name,
          image: data.image,
          gameName: data.gameName,
          gameUrl: data.gameUrl,
          gameName2: data.gameName2,
          gameUrl2: data.gameUrl2,
          title: data.title,
          website: data.website,
          twitter: data.twitter,
          linkedin: data.linkedin,
          github: data.github,
          content,
          contentHtml,
          slug
        };
      });
    
    return speakers.sort((a, b) => {
      // For fallback, try to sort by numeric id if possible
      const aId = parseInt(a.id);
      const bId = parseInt(b.id);
      if (!isNaN(aId) && !isNaN(bId)) {
        return aId - bId;
      }
      return 0;
    });
  }
}
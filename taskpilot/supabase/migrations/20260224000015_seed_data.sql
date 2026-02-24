-- Migration: Seed initial data
-- Description: Insert default template categories and system templates

-- ============================================
-- TEMPLATE CATEGORIES
-- ============================================

INSERT INTO public.template_categories (name, slug, description, icon, display_order) VALUES
    ('Research', 'research', 'Market research, competitor analysis, industry trends', 'search', 1),
    ('Content', 'content', 'Blog posts, articles, product descriptions', 'file-text', 2),
    ('Email Outreach', 'email', 'Cold emails, follow-ups, sequences', 'mail', 3),
    ('Data Analysis', 'data_analysis', 'Survey analysis, reports, KPIs', 'bar-chart-2', 4),
    ('Social Media', 'social_media', 'Social posts, captions, threads', 'share-2', 5),
    ('SEO', 'seo', 'Keywords, meta descriptions, content optimization', 'trending-up', 6),
    ('Other', 'other', 'Miscellaneous templates', 'folder', 99)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SYSTEM TEMPLATES
-- ============================================

-- Research Templates
INSERT INTO public.templates (name, description, category, prompt_template, parameters, example_output, is_public, is_active) VALUES
(
    'Market Research Report',
    'Comprehensive market research on a specific industry or product category',
    'research',
    'Conduct comprehensive market research on {{topic}}. Include:
1. Market size and growth trends
2. Key players and market share
3. Target audience demographics
4. Industry trends and opportunities
5. Potential challenges and risks
{{#if depth}}Research depth: {{depth}}{{/if}}
{{#if focus_areas}}Focus particularly on: {{focus_areas}}{{/if}}',
    '[
        {"name": "topic", "type": "string", "required": true, "description": "Topic or industry to research", "placeholder": "e.g., CRM software for small businesses"},
        {"name": "depth", "type": "enum", "required": false, "options": ["overview", "detailed", "comprehensive"], "default": "detailed", "description": "Research depth level"},
        {"name": "focus_areas", "type": "string", "required": false, "description": "Specific areas to focus on", "placeholder": "e.g., pricing, features, integrations"}
    ]',
    '# Market Research: CRM Software for Small Businesses

## Executive Summary
The CRM software market for small businesses is experiencing rapid growth...

## Market Overview
- Market Size: $48.2B (2025)
- CAGR: 13.4% (2025-2030)
...',
    TRUE,
    TRUE
),
(
    'Competitor Analysis',
    'Detailed analysis of competitors in your market',
    'research',
    'Analyze the following competitors in the {{industry}} industry: {{competitors}}.
For each competitor, provide:
1. Company overview and market position
2. Products/services and pricing
3. Strengths and weaknesses
4. Marketing strategies
5. Recent news and developments
{{#if comparison_focus}}Focus comparison on: {{comparison_focus}}{{/if}}',
    '[
        {"name": "industry", "type": "string", "required": true, "description": "Your industry/market", "placeholder": "e.g., project management software"},
        {"name": "competitors", "type": "string", "required": true, "description": "Comma-separated list of competitors", "placeholder": "e.g., Asana, Monday.com, Basecamp"},
        {"name": "comparison_focus", "type": "string", "required": false, "description": "Specific aspects to compare", "placeholder": "e.g., pricing, features, user experience"}
    ]',
    NULL,
    TRUE,
    TRUE
),
(
    'Industry Trends Analysis',
    'Analysis of current and emerging trends in your industry',
    'research',
    'Analyze current and emerging trends in the {{industry}} industry.
Include:
1. Top 5-7 current trends with evidence
2. Emerging technologies and innovations
3. Changing consumer behaviors
4. Regulatory changes and impact
5. Predictions for the next {{timeframe}}
{{#if specific_topics}}Pay special attention to: {{specific_topics}}{{/if}}',
    '[
        {"name": "industry", "type": "string", "required": true, "description": "Industry to analyze", "placeholder": "e.g., e-commerce, healthcare, fintech"},
        {"name": "timeframe", "type": "enum", "required": false, "options": ["1 year", "2-3 years", "5 years"], "default": "2-3 years", "description": "Prediction timeframe"},
        {"name": "specific_topics", "type": "string", "required": false, "description": "Specific topics of interest"}
    ]',
    NULL,
    TRUE,
    TRUE
);

-- Content Templates
INSERT INTO public.templates (name, description, category, prompt_template, parameters, example_output, is_public, is_active) VALUES
(
    'Blog Post',
    'SEO-optimized blog post on any topic',
    'content',
    'Write a {{tone}} blog post about {{topic}}.
Target length: {{length}} words
Target keyword: {{keyword}}
Target audience: {{audience}}

Requirements:
- Engaging introduction with hook
- Clear subheadings (H2, H3)
- Actionable advice
- Conclusion with CTA
{{#if additional_requirements}}Additional requirements: {{additional_requirements}}{{/if}}',
    '[
        {"name": "topic", "type": "string", "required": true, "description": "Blog post topic", "placeholder": "e.g., 10 Productivity Tips for Remote Workers"},
        {"name": "keyword", "type": "string", "required": true, "description": "Target SEO keyword", "placeholder": "e.g., remote work productivity"},
        {"name": "audience", "type": "string", "required": true, "description": "Target audience", "placeholder": "e.g., remote workers, small business owners"},
        {"name": "tone", "type": "enum", "required": false, "options": ["professional", "casual", "authoritative", "friendly"], "default": "professional", "description": "Writing tone"},
        {"name": "length", "type": "enum", "required": false, "options": ["800", "1200", "1500", "2000"], "default": "1200", "description": "Target word count"},
        {"name": "additional_requirements", "type": "string", "required": false, "description": "Any additional requirements"}
    ]',
    NULL,
    TRUE,
    TRUE
),
(
    'Product Description',
    'Compelling product description for e-commerce',
    'content',
    'Write a compelling product description for {{product_name}}.

Product details:
- Category: {{category}}
- Key features: {{features}}
- Target customer: {{target_customer}}
{{#if benefits}}Key benefits: {{benefits}}{{/if}}
{{#if price_point}}Price point: {{price_point}}{{/if}}

Style: {{style}}
Include: Hook, features, benefits, social proof element, CTA',
    '[
        {"name": "product_name", "type": "string", "required": true, "description": "Product name", "placeholder": "e.g., EcoSmart Water Bottle"},
        {"name": "category", "type": "string", "required": true, "description": "Product category", "placeholder": "e.g., Sports & Outdoors"},
        {"name": "features", "type": "string", "required": true, "description": "Key product features", "placeholder": "e.g., 32oz, double-wall insulation, BPA-free"},
        {"name": "target_customer", "type": "string", "required": true, "description": "Target customer profile", "placeholder": "e.g., health-conscious professionals"},
        {"name": "benefits", "type": "string", "required": false, "description": "Key benefits to highlight"},
        {"name": "price_point", "type": "string", "required": false, "description": "Price positioning"},
        {"name": "style", "type": "enum", "required": false, "options": ["luxurious", "practical", "playful", "technical"], "default": "practical", "description": "Writing style"}
    ]',
    NULL,
    TRUE,
    TRUE
),
(
    'Landing Page Copy',
    'Conversion-focused landing page copy',
    'content',
    'Write landing page copy for {{product_service}}.

Goal: {{goal}}
Target audience: {{audience}}
Unique value proposition: {{uvp}}
{{#if pain_points}}Pain points to address: {{pain_points}}{{/if}}
{{#if social_proof}}Social proof elements: {{social_proof}}{{/if}}

Include:
- Headline and subheadline
- Hero section
- Features/benefits section
- Social proof section
- FAQ section (3-5 questions)
- Final CTA',
    '[
        {"name": "product_service", "type": "string", "required": true, "description": "Product or service name", "placeholder": "e.g., TaskPilot AI Task Automation"},
        {"name": "goal", "type": "string", "required": true, "description": "Primary conversion goal", "placeholder": "e.g., Free trial signup"},
        {"name": "audience", "type": "string", "required": true, "description": "Target audience", "placeholder": "e.g., busy entrepreneurs"},
        {"name": "uvp", "type": "string", "required": true, "description": "Unique value proposition", "placeholder": "e.g., Save 10+ hours per week with AI task automation"},
        {"name": "pain_points", "type": "string", "required": false, "description": "Customer pain points"},
        {"name": "social_proof", "type": "string", "required": false, "description": "Available social proof elements"}
    ]',
    NULL,
    TRUE,
    TRUE
);

-- Email Templates
INSERT INTO public.templates (name, description, category, prompt_template, parameters, example_output, is_public, is_active) VALUES
(
    'Cold Outreach Email',
    'Personalized cold email for B2B outreach',
    'email',
    'Write a cold outreach email for {{purpose}}.

Sender: {{sender_role}} at {{company}}
Recipient: {{recipient_role}} at {{recipient_company}}
{{#if recipient_context}}Context about recipient: {{recipient_context}}{{/if}}

Value proposition: {{value_prop}}
Desired action: {{cta}}

Requirements:
- Subject line (A/B test options)
- Personalized opening
- Clear value proposition
- Soft CTA
- Keep under 150 words',
    '[
        {"name": "purpose", "type": "string", "required": true, "description": "Purpose of outreach", "placeholder": "e.g., partnership discussion, demo request"},
        {"name": "sender_role", "type": "string", "required": true, "description": "Your role", "placeholder": "e.g., Head of Partnerships"},
        {"name": "company", "type": "string", "required": true, "description": "Your company name"},
        {"name": "recipient_role", "type": "string", "required": true, "description": "Recipient''s role", "placeholder": "e.g., VP of Marketing"},
        {"name": "recipient_company", "type": "string", "required": true, "description": "Recipient''s company"},
        {"name": "recipient_context", "type": "string", "required": false, "description": "Any context about the recipient"},
        {"name": "value_prop", "type": "string", "required": true, "description": "Your value proposition"},
        {"name": "cta", "type": "string", "required": true, "description": "Desired action", "placeholder": "e.g., 15-min call, reply with interest"}
    ]',
    NULL,
    TRUE,
    TRUE
),
(
    'Follow-up Email Sequence',
    'Multi-touch follow-up email sequence',
    'email',
    'Create a {{sequence_length}}-email follow-up sequence for {{context}}.

Original outreach purpose: {{original_purpose}}
Key message: {{key_message}}
Final CTA: {{final_cta}}

Requirements:
- Each email should add new value
- Varying subject lines
- Escalating urgency (subtle)
- Different angles/hooks
- Email 1: 3 days after initial
- Subsequent: 4-5 days apart',
    '[
        {"name": "context", "type": "string", "required": true, "description": "Follow-up context", "placeholder": "e.g., after demo, after proposal, cold outreach"},
        {"name": "original_purpose", "type": "string", "required": true, "description": "Original outreach purpose"},
        {"name": "key_message", "type": "string", "required": true, "description": "Key message to reinforce"},
        {"name": "final_cta", "type": "string", "required": true, "description": "Final desired action"},
        {"name": "sequence_length", "type": "enum", "required": false, "options": ["3", "4", "5"], "default": "3", "description": "Number of follow-up emails"}
    ]',
    NULL,
    TRUE,
    TRUE
);

-- Data Analysis Templates
INSERT INTO public.templates (name, description, category, prompt_template, parameters, example_output, is_public, is_active) VALUES
(
    'Survey Results Analysis',
    'Comprehensive analysis of survey data',
    'data_analysis',
    'Analyze the following survey results about {{survey_topic}}.

Survey data/summary:
{{survey_data}}

Provide:
1. Executive summary
2. Key findings (top 5-7)
3. Segment analysis (if applicable)
4. Trends and patterns
5. Actionable recommendations
6. Limitations and caveats

{{#if comparison}}Compare with: {{comparison}}{{/if}}
{{#if focus}}Focus on: {{focus}}{{/if}}',
    '[
        {"name": "survey_topic", "type": "string", "required": true, "description": "Survey topic", "placeholder": "e.g., Customer Satisfaction Q4 2025"},
        {"name": "survey_data", "type": "string", "required": true, "description": "Survey data or summary (paste or describe)"},
        {"name": "comparison", "type": "string", "required": false, "description": "Previous data to compare with"},
        {"name": "focus", "type": "string", "required": false, "description": "Specific areas to focus analysis on"}
    ]',
    NULL,
    TRUE,
    TRUE
),
(
    'KPI Dashboard Summary',
    'Executive summary of business KPIs',
    'data_analysis',
    'Create an executive summary for {{business}} based on these KPIs:

{{kpi_data}}

Period: {{period}}
{{#if targets}}Targets: {{targets}}{{/if}}
{{#if previous_period}}Previous period comparison: {{previous_period}}{{/if}}

Include:
1. Overall performance summary
2. Highlights and wins
3. Areas of concern
4. Root cause analysis for any misses
5. Recommended actions
6. Forecast/outlook',
    '[
        {"name": "business", "type": "string", "required": true, "description": "Business/department name"},
        {"name": "kpi_data", "type": "string", "required": true, "description": "KPI data (paste or describe)"},
        {"name": "period", "type": "string", "required": true, "description": "Reporting period", "placeholder": "e.g., January 2026, Q4 2025"},
        {"name": "targets", "type": "string", "required": false, "description": "KPI targets if available"},
        {"name": "previous_period", "type": "string", "required": false, "description": "Previous period data for comparison"}
    ]',
    NULL,
    TRUE,
    TRUE
);

-- Social Media Templates
INSERT INTO public.templates (name, description, category, prompt_template, parameters, example_output, is_public, is_active) VALUES
(
    'Social Media Content Calendar',
    'Week of social media content for multiple platforms',
    'social_media',
    'Create a 1-week social media content calendar for {{brand}}.

Brand voice: {{brand_voice}}
Industry: {{industry}}
Target audience: {{audience}}
Platforms: {{platforms}}
{{#if themes}}Weekly themes/topics: {{themes}}{{/if}}
{{#if promotions}}Promotions to include: {{promotions}}{{/if}}

For each post include:
- Platform
- Post type (image, video, carousel, text)
- Caption with hashtags
- Best posting time
- Engagement prompt',
    '[
        {"name": "brand", "type": "string", "required": true, "description": "Brand name"},
        {"name": "brand_voice", "type": "string", "required": true, "description": "Brand voice description", "placeholder": "e.g., professional yet approachable, witty"},
        {"name": "industry", "type": "string", "required": true, "description": "Industry"},
        {"name": "audience", "type": "string", "required": true, "description": "Target audience"},
        {"name": "platforms", "type": "string", "required": true, "description": "Platforms to post on", "placeholder": "e.g., LinkedIn, Twitter, Instagram"},
        {"name": "themes", "type": "string", "required": false, "description": "Weekly themes or topics to cover"},
        {"name": "promotions", "type": "string", "required": false, "description": "Any promotions or campaigns to include"}
    ]',
    NULL,
    TRUE,
    TRUE
),
(
    'LinkedIn Post',
    'Engaging LinkedIn post for thought leadership',
    'social_media',
    'Write a LinkedIn post about {{topic}}.

Author: {{author_role}}
Goal: {{goal}}
Tone: {{tone}}
{{#if hook}}Opening hook idea: {{hook}}{{/if}}

Requirements:
- Strong hook in first line
- Personal insight or story element
- Actionable takeaway
- Engagement question at end
- 3-5 relevant hashtags
- Optimal length: 150-300 words',
    '[
        {"name": "topic", "type": "string", "required": true, "description": "Post topic", "placeholder": "e.g., lessons from scaling to 100 employees"},
        {"name": "author_role", "type": "string", "required": true, "description": "Author''s role/position", "placeholder": "e.g., CEO, Marketing Director"},
        {"name": "goal", "type": "enum", "required": true, "options": ["thought_leadership", "engagement", "traffic", "recruiting", "brand_awareness"], "description": "Primary goal"},
        {"name": "tone", "type": "enum", "required": false, "options": ["inspirational", "educational", "conversational", "provocative"], "default": "conversational", "description": "Writing tone"},
        {"name": "hook", "type": "string", "required": false, "description": "Any specific hook idea"}
    ]',
    NULL,
    TRUE,
    TRUE
);

-- SEO Templates
INSERT INTO public.templates (name, description, category, prompt_template, parameters, example_output, is_public, is_active) VALUES
(
    'SEO Keyword Research',
    'Comprehensive keyword research for content strategy',
    'seo',
    'Conduct keyword research for {{topic}} in the {{industry}} industry.

Target audience: {{audience}}
Website/business type: {{business_type}}
{{#if competitors}}Competitor websites: {{competitors}}{{/if}}
{{#if existing_content}}Existing content/pages: {{existing_content}}{{/if}}

Provide:
1. Primary keywords (5-10) with estimated difficulty
2. Secondary keywords (10-15)
3. Long-tail keywords (15-20)
4. Question-based keywords (10+)
5. Content clusters/topic groups
6. Quick wins (low competition)
7. Content recommendations for each cluster',
    '[
        {"name": "topic", "type": "string", "required": true, "description": "Main topic/niche", "placeholder": "e.g., project management software"},
        {"name": "industry", "type": "string", "required": true, "description": "Industry"},
        {"name": "audience", "type": "string", "required": true, "description": "Target audience"},
        {"name": "business_type", "type": "string", "required": true, "description": "Type of website/business", "placeholder": "e.g., B2B SaaS, e-commerce, blog"},
        {"name": "competitors", "type": "string", "required": false, "description": "Competitor websites to analyze"},
        {"name": "existing_content", "type": "string", "required": false, "description": "Existing content or pages"}
    ]',
    NULL,
    TRUE,
    TRUE
),
(
    'Meta Tags Optimization',
    'SEO meta tags for web pages',
    'seo',
    'Create optimized meta tags for the following page:

Page type: {{page_type}}
Primary keyword: {{keyword}}
Page content/topic: {{content_summary}}
{{#if brand}}Brand name: {{brand}}{{/if}}
{{#if unique_value}}Unique selling point: {{unique_value}}{{/if}}

Provide:
1. Title tag (50-60 chars) - 3 variations
2. Meta description (150-160 chars) - 3 variations
3. H1 tag suggestion
4. Schema markup recommendations
5. Open Graph tags
6. Twitter Card tags',
    '[
        {"name": "page_type", "type": "enum", "required": true, "options": ["homepage", "product", "category", "blog_post", "landing_page", "about"], "description": "Type of page"},
        {"name": "keyword", "type": "string", "required": true, "description": "Primary target keyword"},
        {"name": "content_summary", "type": "string", "required": true, "description": "Brief summary of page content"},
        {"name": "brand", "type": "string", "required": false, "description": "Brand name to include"},
        {"name": "unique_value", "type": "string", "required": false, "description": "Unique selling point to highlight"}
    ]',
    NULL,
    TRUE,
    TRUE
);

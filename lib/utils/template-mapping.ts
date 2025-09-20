import { ProductManagerFormData } from '@/types';
import { Template } from '@/lib/actions/template.actions';

export interface TemplateFormMapping {
    step1: {
        productName: string;
        productPitch: string;
        industry: string;
        currentStage: string;
    };
    step2: {
        targetUsers: string;
        painPoints: string[];
        primaryJobToBeDone: string;
    };
    step3: {
        competitors: string[];
        differentiation: string;
        marketTrend: string;
    };
    step4: {
        valueProposition: string;
        productVision: string;
        successMetric: string;
    };
    step5: {
        mustHaveFeatures: string[];
        niceToHaveFeatures: string[];
        constraints: string;
        prioritizationMethod: string;
    };
}

export const CATEGORY_MAPPINGS = {
    industry: {
        'Social': 'social',
        'E-commerce': 'ecommerce',
        'Business': 'saas',
        'Education': 'edtech',
        'Healthcare': 'healthtech',
        'Productivity': 'productivity',
    },

    targetUsers: {
        'Social': 'Social media users, content creators, and community managers who want to connect and share experiences',
        'E-commerce': 'Online retailers, small business owners, and entrepreneurs looking to sell products or services online',
        'Business': 'Business professionals, team leaders, and organizations seeking to improve operational efficiency',
        'Education': 'Educators, students, and educational institutions focused on learning and knowledge sharing',
        'Healthcare': 'Healthcare professionals, patients, and medical organizations managing health-related workflows',
        'Productivity': 'Knowledge workers, remote teams, and individuals looking to optimize their daily workflows',
    },

    painPoints: {
        'Social': [
            'Difficulty in building authentic connections online',
            'Content discovery and engagement challenges',
            'Privacy and security concerns with personal data'
        ],
        'E-commerce': [
            'Complex inventory and order management',
            'High transaction fees and payment processing issues',
            'Customer acquisition and retention challenges'
        ],
        'Business': [
            'Inefficient workflow and process management',
            'Poor team collaboration and communication',
            'Lack of data-driven decision making tools'
        ],
        'Education': [
            'Limited access to quality educational resources',
            'Difficulty in tracking learning progress',
            'Lack of personalized learning experiences'
        ],
        'Healthcare': [
            'Complex patient data management',
            'Inefficient appointment and scheduling systems',
            'Poor communication between healthcare providers'
        ],
        'Productivity': [
            'Time management and task prioritization issues',
            'Scattered tools and lack of integration',
            'Difficulty in maintaining focus and avoiding distractions'
        ]
    },

    competitors: {
        'Social': [
            { name: 'Facebook', note: 'Dominant social networking platform' },
            { name: 'Instagram', note: 'Visual content sharing platform' },
            { name: 'Twitter', note: 'Microblogging and news platform' },
            { name: 'TikTok', note: 'Short-form video content platform' }
        ],
        'E-commerce': [
            { name: 'Amazon', note: 'Global e-commerce marketplace leader' },
            { name: 'Shopify', note: 'E-commerce platform for businesses' },
            { name: 'Etsy', note: 'Marketplace for handmade and vintage items' },
            { name: 'eBay', note: 'Online auction and marketplace platform' }
        ],
        'Business': [
            { name: 'Slack', note: 'Team communication and collaboration' },
            { name: 'Microsoft Teams', note: 'Enterprise collaboration platform' },
            { name: 'Asana', note: 'Project management and team coordination' },
            { name: 'Monday.com', note: 'Work operating system platform' }
        ],
        'Education': [
            { name: 'Coursera', note: 'Online learning platform with university courses' },
            { name: 'Udemy', note: 'Marketplace for online courses' },
            { name: 'Khan Academy', note: 'Free educational platform' },
            { name: 'Blackboard', note: 'Learning management system for institutions' }
        ],
        'Healthcare': [
            { name: 'Epic', note: 'Electronic health records system' },
            { name: 'Cerner', note: 'Healthcare information technology' },
            { name: 'Teladoc', note: 'Telemedicine and virtual care platform' },
            { name: 'Zocdoc', note: 'Online medical appointment booking' }
        ],
        'Productivity': [
            { name: 'Notion', note: 'All-in-one workspace and note-taking' },
            { name: 'Trello', note: 'Kanban-style project management' },
            { name: 'Todoist', note: 'Task management and productivity app' },
            { name: 'Evernote', note: 'Note-taking and organization platform' }
        ]
    },

    valueProposition: {
        'Social': 'Create meaningful connections through an intuitive social platform that prioritizes authentic interactions and user privacy',
        'E-commerce': 'Streamline your online business with an all-in-one marketplace solution that reduces complexity and increases sales',
        'Business': 'Transform your organization\'s productivity with integrated tools that enhance collaboration and data-driven decision making',
        'Education': 'Revolutionize learning experiences with personalized, accessible educational tools that adapt to individual needs',
        'Healthcare': 'Improve patient care and operational efficiency through comprehensive healthcare management solutions',
        'Productivity': 'Maximize your potential with unified productivity tools that eliminate distractions and optimize workflow efficiency'
    },

    productVision: {
        'Social': 'To become the most trusted social platform that fosters genuine human connections while protecting user privacy and well-being',
        'E-commerce': 'To democratize e-commerce by providing small businesses with enterprise-level tools to compete in the global marketplace',
        'Business': 'To be the central nervous system for modern organizations, enabling seamless collaboration and intelligent decision-making',
        'Education': 'To make quality education accessible to everyone, everywhere, through personalized and adaptive learning experiences',
        'Healthcare': 'To transform healthcare delivery by connecting patients, providers, and data in a seamless, secure ecosystem',
        'Productivity': 'To eliminate productivity barriers and help individuals and teams achieve their highest potential through intelligent automation'
    }
};

export function convertTemplateToFormData(template: Template): ProductManagerFormData {
    const category = template.category;

    return {
        step1: {
            productName: cleanProductName(template.name),
            productPitch: template.description,
            industry: CATEGORY_MAPPINGS.industry[category as keyof typeof CATEGORY_MAPPINGS.industry] || 'other',
            currentStage: 'idea',
        },
        step2: {
            targetUsers: CATEGORY_MAPPINGS.targetUsers[category as keyof typeof CATEGORY_MAPPINGS.targetUsers] || 'Users seeking efficient solutions for their daily workflows and tasks',
            painPoints: CATEGORY_MAPPINGS.painPoints[category as keyof typeof CATEGORY_MAPPINGS.painPoints] || ['Inefficient current solutions', 'Lack of integrated tools', 'Poor user experience'],
            primaryJobToBeDone: `Efficiently manage ${category.toLowerCase()} operations and workflows while providing exceptional user experience`,
        },
        step3: {
            competitors: CATEGORY_MAPPINGS.competitors[category as keyof typeof CATEGORY_MAPPINGS.competitors] || [{ name: 'Generic Competitor', note: 'Market competitor' }],
            differentiation: `Unlike other ${category.toLowerCase()} solutions, this product combines ${template.features.slice(0, 2).join(' and ').toLowerCase()} in one integrated platform with superior user experience and advanced features`,
            marketTrend: `Growing demand for ${category.toLowerCase()} solutions driven by digital transformation, remote work trends, and increasing user expectations for seamless experiences`,
        },
        step4: {
            valueProposition: CATEGORY_MAPPINGS.valueProposition[category as keyof typeof CATEGORY_MAPPINGS.valueProposition] || `Deliver exceptional value through innovative ${category.toLowerCase()} solutions`,
            productVision: CATEGORY_MAPPINGS.productVision[category as keyof typeof CATEGORY_MAPPINGS.productVision] || `To lead innovation in ${category.toLowerCase()} solutions and create lasting positive impact`,
            successMetric: `Achieve 40% improvement in user productivity and 90% user satisfaction within 6 months of launch`,
        },
        step5: {
            mustHaveFeatures: template.features.slice(0, Math.min(5, template.features.length)),
            niceToHaveFeatures: template.features.slice(5, Math.min(10, template.features.length)),
            constraints: `Budget constraints, technical limitations, and regulatory compliance requirements specific to ${category.toLowerCase()} industry`,
            prioritizationMethod: 'RICE',
        },
    };
}

function cleanProductName(name: string): string {
    return name
        .replace(' Template', '')
        .replace(' Platform', '')
        .replace(' Marketplace', '')
        .replace(' Application', '')
        .replace(' App', '')
        .trim();
}

export function getTemplatePreviewData(template: Template): {
    formFieldsPopulated: number;
    totalFormFields: number;
    populatedFields: string[];
} {
    const formData = convertTemplateToFormData(template);

    const populatedFields: string[] = [];
    let totalFields = 0;
    let populatedCount = 0;

    // Count Step 1 fields
    totalFields += 4;
    if (formData.step1.productName) { populatedCount++; populatedFields.push('Product Name'); }
    if (formData.step1.productPitch) { populatedCount++; populatedFields.push('Product Pitch'); }
    if (formData.step1.industry) { populatedCount++; populatedFields.push('Industry'); }
    if (formData.step1.currentStage) { populatedCount++; populatedFields.push('Current Stage'); }

    // Count Step 2 fields
    totalFields += 3;
    if (formData.step2.targetUsers) { populatedCount++; populatedFields.push('Target Users'); }
    if (formData.step2.painPoints.length > 0) { populatedCount++; populatedFields.push('Pain Points'); }
    if (formData.step2.primaryJobToBeDone) { populatedCount++; populatedFields.push('Primary Job To Be Done'); }

    // Count Step 3 fields
    totalFields += 3;
    if (formData.step3.competitors.length > 0) { populatedCount++; populatedFields.push('Competitors'); }
    if (formData.step3.differentiation) { populatedCount++; populatedFields.push('Differentiation'); }
    if (formData.step3.marketTrend) { populatedCount++; populatedFields.push('Market Trend'); }

    // Count Step 4 fields
    totalFields += 3;
    if (formData.step4.valueProposition) { populatedCount++; populatedFields.push('Value Proposition'); }
    if (formData.step4.productVision) { populatedCount++; populatedFields.push('Product Vision'); }
    if (formData.step4.successMetric) { populatedCount++; populatedFields.push('Success Metric'); }

    // Count Step 5 fields
    totalFields += 4;
    if (formData.step5.mustHaveFeatures.length > 0) { populatedCount++; populatedFields.push('Must-Have Features'); }
    if (formData.step5.niceToHaveFeatures.length > 0) { populatedCount++; populatedFields.push('Nice-to-Have Features'); }
    if (formData.step5.constraints) { populatedCount++; populatedFields.push('Constraints'); }
    if (formData.step5.prioritizationMethod) { populatedCount++; populatedFields.push('Prioritization Method'); }

    return {
        formFieldsPopulated: populatedCount,
        totalFormFields: totalFields,
        populatedFields
    };
}
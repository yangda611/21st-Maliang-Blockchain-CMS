# 21st Maliang Blockchain CMS Constitution
<!-- Sync Impact Report:
Version change: N/A → 1.0.0 (new constitution)
Modified principles: All principles updated to reflect project-specific requirements
Added sections: Technical Architecture, Development Workflow (replaced generic placeholders)
Removed sections: None
Templates requiring updates: ✅ plan-template.md (updated version reference), spec-template.md (no changes needed), tasks-template.md (no changes needed), agent-file-template.md (no changes needed)
Follow-up TODOs: None - constitution is complete and all placeholders filled
-->

## Core Principles

### I. User Experience First
All features must prioritize seamless, responsive user experiences with smooth animations and no-refresh interactions to engage visitors effectively. Components should provide intuitive navigation and immediate feedback to enhance user satisfaction and retention.

### II. Dark Sci-Fi Aesthetic
Maintain a consistent dark sci-fi visual style across all components, ensuring a modern, tech-forward appearance that aligns with blockchain themes. Use dark color schemes, subtle gradients, and futuristic design elements to create an immersive, professional atmosphere.

### III. Content Management Excellence
Enable robust product news display, customer contact collection, and SEO optimization features to support company product promotion goals. The CMS must facilitate easy content creation, management, and distribution while ensuring search engine visibility and lead generation capabilities.

### IV. Performance Optimization
Implement efficient loading, caching, and SEO best practices to ensure fast, accessible, and search-engine friendly web experiences. Pages must load quickly, handle various device sizes gracefully, and maintain performance under different network conditions.

### V. Technological Consistency
Utilize the specified tech stack (Next.js 14 with App Router, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Supabase) consistently across all components. All new features must integrate seamlessly with this stack and avoid introducing incompatible technologies without justification.

## Technical Architecture
The system must use Next.js 14 with App Router for the frontend framework, TypeScript for type safety, Tailwind CSS for styling, shadcn/ui for reusable UI components, Framer Motion for animations, and Supabase for backend services including authentication and database operations. All code must be responsive, avoid page refreshes where possible, and maintain the dark sci-fi aesthetic through consistent styling and component design.

## Development Workflow
Development must follow responsive design principles with mobile-first approach, implement smooth transition animations using Framer Motion, and ensure no-refresh user interactions through client-side routing. Code reviews must verify adherence to the dark theme, component reusability, and performance standards. Testing should include user experience validation, SEO optimization checks, and cross-device compatibility testing.

## Governance
This constitution supersedes all other development practices and design decisions. Amendments require team approval, must be documented with rationale, and include a migration plan for existing code. All pull requests and code reviews must verify compliance with these principles. Complexity introduced must be justified by clear user benefit or technical necessity. Use this constitution for all development guidance and decision-making.

**Version**: 1.0.0 | **Ratified**: 2025-10-02 | **Last Amended**: 2025-10-02
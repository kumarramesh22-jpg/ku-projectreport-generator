import type { Course } from '@/types';

export interface ChapterDefinition {
  number: number;
  title: string;
  subtitle: string;
  prompt: string;
}

const MBA_CHAPTERS: ChapterDefinition[] = [
  {
    number: 1,
    title: 'Research Design',
    subtitle: 'Methodology and research framework',
    prompt: `Write Chapter 1: Research Design for this MBA project report.

Cover the following sections in order:
1.1 Introduction to the Research Problem
1.2 Research Objectives (state at least 5 clear objectives)
1.3 Research Questions
1.4 Scope of the Study
1.5 Limitations of the Study
1.6 Research Methodology (qualitative/quantitative/mixed, justify the choice)
1.7 Sampling Design (population, sample size, sampling technique — justify each)
1.8 Data Collection Methods (primary and secondary sources)
1.9 Research Instruments (questionnaire design, interview structure, etc.)
1.10 Framework of Analysis (statistical tools or analytical techniques to be used)
1.11 Chapter Summary`,
  },
  {
    number: 2,
    title: 'Industry Profile',
    subtitle: 'Sector overview and industry context',
    prompt: `Write Chapter 2: Industry Profile for this MBA project report.

Cover the following sections in order:
2.1 Introduction to the Industry
2.2 Historical Evolution of the Industry
2.3 Current Market Size and Growth Trends (cite plausible figures for the Indian context)
2.4 Key Players and Competitive Landscape
2.5 Porter's Five Forces Analysis of the Industry
2.6 SWOT Analysis of the Industry
2.7 Regulatory and Policy Environment
2.8 Technological Disruptions and Innovations
2.9 Future Outlook and Emerging Trends
2.10 Relevance of the Industry to the Study
2.11 Chapter Summary`,
  },
  {
    number: 3,
    title: 'Literature Review',
    subtitle: 'Review of existing research and theoretical framework',
    prompt: `Write Chapter 3: Literature Review for this MBA project report.

Cover the following sections in order:
3.1 Introduction to the Literature Review
3.2 Theoretical Framework (identify and explain 2-3 relevant theories or models)
3.3 Review of Indian Studies (summarize at least 5 plausible Indian research studies with author names, year, findings)
3.4 Review of International Studies (summarize at least 3 plausible international studies)
3.5 Research Gap Identification
3.6 Conceptual Framework of the Study (describe the proposed model with variables)
3.7 Hypotheses Formulation (state at least 4 testable hypotheses)
3.8 Chapter Summary`,
  },
  {
    number: 4,
    title: 'Data Analysis Framework',
    subtitle: 'Analytical techniques and data interpretation plan',
    prompt: `Write Chapter 4: Data Analysis Framework for this MBA project report.

Cover the following sections in order:
4.1 Introduction to Data Analysis
4.2 Data Preparation and Cleaning Procedures
4.3 Descriptive Statistics Plan (mean, median, mode, standard deviation, frequency distribution)
4.4 Reliability Test (Cronbach's Alpha — describe the procedure and expected threshold)
4.5 Inferential Statistics Plan (chi-square test, t-test, ANOVA, correlation, regression — justify each relevant test)
4.6 Hypothesis Testing Framework (map each hypothesis to the statistical test)
4.7 Data Visualization Plan (charts, graphs, tables to be used)
4.8 Software Tools for Analysis (SPSS, Excel, R, Python — justify choice)
4.9 Interpretation Guidelines
4.10 Chapter Summary`,
  },
  {
    number: 5,
    title: 'Findings',
    subtitle: 'Expected findings, conclusions, and recommendations',
    prompt: `Write Chapter 5: Findings, Conclusions and Recommendations for this MBA project report.

Cover the following sections in order:
5.1 Introduction
5.2 Summary of Key Findings (present at least 6-8 expected findings linked to research objectives)
5.3 Hypothesis-Wise Results Interpretation
5.4 Discussion of Findings (relate findings to the theoretical framework and literature reviewed in Chapter 3)
5.5 Managerial Implications (at least 5 actionable recommendations for practitioners)
5.6 Theoretical Contributions
5.7 Conclusion
5.8 Limitations of the Study
5.9 Scope for Future Research (suggest at least 4 directions)
5.10 Concluding Remarks`,
  },
];

const BTECH_CHAPTERS: ChapterDefinition[] = [
  {
    number: 1,
    title: 'Introduction',
    subtitle: 'Project overview, objectives, and scope',
    prompt: `Write Chapter 1: Introduction for this B.Tech project report.

Cover the following sections in order:
1.1 Introduction to the Problem Domain
1.2 Problem Statement
1.3 Motivation for the Project
1.4 Project Objectives (state at least 5 clear, measurable objectives)
1.5 Scope of the Project
1.6 Limitations
1.7 Organization of the Report (briefly describe what each subsequent chapter covers)
1.8 Chapter Summary`,
  },
  {
    number: 2,
    title: 'Literature Survey',
    subtitle: 'Review of existing work and technologies',
    prompt: `Write Chapter 2: Literature Survey for this B.Tech project report.

Cover the following sections in order:
2.1 Introduction
2.2 Background and Related Concepts
2.3 Review of Existing Systems (summarize at least 5 plausible existing solutions or papers with author names, year, key features, and limitations)
2.4 Comparison of Existing Systems (include a comparison table)
2.5 Technologies and Tools Survey (relevant frameworks, libraries, platforms)
2.6 Research Gap and Problem Identification
2.7 Proposed Solution Overview
2.8 Chapter Summary`,
  },
  {
    number: 3,
    title: 'System Analysis & Design',
    subtitle: 'Architecture, modules, and design methodology',
    prompt: `Write Chapter 3: System Analysis and Design for this B.Tech project report.

Cover the following sections in order:
3.1 Introduction to System Design
3.2 System Requirements (functional requirements — list at least 8; non-functional requirements — list at least 5)
3.3 Hardware and Software Requirements
3.4 System Architecture (describe the overall architecture: client-server, layered, microservices, etc.)
3.5 Module Description (describe each major module with its responsibilities — at least 4 modules)
3.6 Data Flow Diagrams (describe DFD Level 0, Level 1, and Level 2 in text form)
3.7 Entity-Relationship Diagram (describe the database schema and relationships)
3.8 Use Case Diagram Description
3.9 Sequence Diagrams (describe key interaction flows)
3.10 User Interface Design Approach
3.11 Chapter Summary`,
  },
  {
    number: 4,
    title: 'Implementation',
    subtitle: 'Development approach, tools, and code structure',
    prompt: `Write Chapter 4: Implementation for this B.Tech project report.

Cover the following sections in order:
4.1 Introduction to Implementation
4.2 Development Environment Setup (IDE, frameworks, languages, version control)
4.3 Implementation of Module 1 (describe the implementation approach, key algorithms, and logic)
4.4 Implementation of Module 2
4.5 Implementation of Module 3
4.6 Implementation of Module 4
4.7 Database Implementation (table creation, queries, connection handling)
4.8 Integration of Modules
4.9 Key Algorithms and Data Structures Used
4.10 Challenges Encountered and Solutions Applied
4.11 Chapter Summary`,
  },
  {
    number: 5,
    title: 'Testing',
    subtitle: 'Testing strategy, test cases, and results',
    prompt: `Write Chapter 5: Testing for this B.Tech project report.

Cover the following sections in order:
5.1 Introduction to Testing
5.2 Testing Objectives
5.3 Types of Testing Performed (unit testing, integration testing, system testing, performance testing, user acceptance testing — describe each)
5.4 Test Environment
5.5 Test Cases (present at least 8 test cases in a tabular format: Test Case ID, Description, Input, Expected Output, Actual Output, Status)
5.6 Unit Testing Details
5.7 Integration Testing Details
5.8 Performance Testing Results (response time, throughput, resource utilization)
5.9 Bug Tracking and Resolution
5.10 User Acceptance Testing
5.11 Test Summary and Coverage
5.12 Chapter Summary`,
  },
  {
    number: 6,
    title: 'Conclusion',
    subtitle: 'Summary, achievements, and future scope',
    prompt: `Write Chapter 6: Conclusion and Future Scope for this B.Tech project report.

Cover the following sections in order:
6.1 Introduction
6.2 Summary of Work Done
6.3 Objectives Achieved (map each objective from Chapter 1 to its outcome)
6.4 Key Contributions of the Project
6.5 Advantages of the Proposed System
6.6 Limitations of the Current System
6.7 Future Enhancements (suggest at least 5 concrete future improvements)
6.8 Real-World Applicability and Deployment Considerations
6.9 Concluding Remarks`,
  },
];

export function getChapters(course: Course): ChapterDefinition[] {
  return course === 'MBA' ? MBA_CHAPTERS : BTECH_CHAPTERS;
}

export function getChapterCount(course: Course): number {
  return course === 'MBA' ? 5 : 6;
}

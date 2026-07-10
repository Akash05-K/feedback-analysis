
const keywordDictionary = {
  Teaching: [
    'teach', 'teaching', 'teacher', 'taught', 'explain', 'explains', 'explained',
    'explanation', 'clarity', 'clear concept', 'understandable', 'easy to understand',
    'well structured', 'pedagogy', 'method of teaching', 'teaching style',
    'teaching method', 'lecture', 'lectures', 'delivery', 'knowledgeable',
    'in depth', 'depth of knowledge', 'subject knowledge', 'concept clarity',
    'simplify', 'simplified', 'illustrat', 'examples given', 'real life examples',
  ],

  Timing: [
    'timing', 'time management', 'punctual', 'punctuality', 'late', 'delay',
    'delayed', 'on time', 'start late', 'end late', 'class timing', 'schedule',
    'rescheduled', 'time waste', 'wasted time', 'session length', 'duration',
    'extended class', 'early end', 'short class', 'time bound', 'deadline missed',
    'started late', 'ended early', 'time management skills',
  ],

  'Study Material': [
    'study material', 'notes', 'handout', 'handouts', 'ppt', 'slides',
    'reference book', 'reference material', 'textbook', 'reading material',
    'material provided', 'pdf notes', 'course material', 'resources shared',
    'study resources', 'e-book', 'ebook', 'question bank', 'material quality',
    'well prepared notes', 'detailed notes', 'summary notes', 'useful material',
    'helpful material', 'insufficient material', 'outdated material',
  ],

  'Practical Sessions': [
    'practical', 'practicals', 'practical session', 'hands on', 'hands-on',
    'lab session', 'lab work', 'demonstration', 'demo', 'workshop', 'exercise',
    'experiment', 'implementation', 'live coding', 'live demo', 'walkthrough',
    'hands on experience', 'practice session', 'real world project',
    'project work', 'application based', 'practical exposure', 'simulation',
  ],

  Assignments: [
    'assignment', 'assignments', 'homework', 'task given', 'submission',
    'deadline', 'assignment feedback', 'grading', 'graded', 'evaluated late',
    'assignment quality', 'too many assignments', 'relevant assignments',
    'assignment difficulty', 'practice problems', 'take home task',
    'weekly assignment', 'assignment review', 'checked assignments',
  ],

  Exams: [
    'exam', 'exams', 'examination', 'test', 'tests', 'quiz', 'quizzes',
    'mid term', 'midterm', 'final exam', 'question paper', 'paper pattern',
    'exam pattern', 'result', 'results', 'marks', 'marking scheme',
    'exam difficulty', 'exam schedule', 'mock test', 'surprise test',
    'exam preparation', 'exam stress', 'grading system', 'evaluation process',
  ],

  Behaviour: [
    'behaviour', 'behavior', 'attitude', 'friendly', 'rude', 'polite',
    'respectful', 'disrespectful', 'humble', 'arrogant', 'supportive',
    'encouraging behaviour', 'kind', 'strict', 'harsh', 'approachable',
    'unapproachable', 'patient', 'impatient', 'caring', 'considerate',
    'good nature', 'temperament', 'calm', 'aggressive', 'cooperative',
  ],

  Communication: [
    'communication', 'communicate', 'communication skills', 'articulate',
    'well spoken', 'voice clarity', 'accent', 'pronunciation', 'fluent',
    'fluency', 'language skills', 'expression', 'presentation skills',
    'verbal skills', 'clear communication', 'poor communication',
    'effective communication', 'listening skills', 'response clarity',
  ],

  'Doubt Clearing': [
    'doubt', 'doubts', 'doubt clearing', 'doubt session', 'query', 'queries',
    'question answered', 'clarify doubts', 'clarification', 'resolved doubts',
    'answered questions', 'q&a session', 'doubt resolution', 'follow up questions',
    'addressed concerns', 'patiently answered', 'ignored questions',
  ],

  'Course Content': [
    'course content', 'curriculum', 'syllabus', 'content quality',
    'course structure', 'topics covered', 'content depth', 'course design',
    'well organized content', 'outdated content', 'updated content',
    'relevant content', 'irrelevant content', 'course outline',
    'module structure', 'content flow', 'well sequenced',
  ],

  'Classroom Management': [
    'classroom management', 'discipline', 'class control', 'noise control',
    'organized class', 'chaotic class', 'classroom environment',
    'classroom atmosphere', 'class discipline', 'managed well',
    'disruption handled', 'orderly class', 'well managed session',
  ],

  'Technology Usage': [
    'technology', 'tech tools', 'software used', 'tools used', 'online platform',
    'lms', 'zoom', 'google meet', 'microsoft teams', 'digital tools',
    'screen sharing', 'virtual whiteboard', 'e-learning platform',
    'video quality', 'audio quality', 'tech issues', 'technical glitches',
    'platform issues', 'app used', 'recording available',
  ],

  Interaction: [
    'interaction', 'interactive', 'engagement', 'engaging', 'participation',
    'class participation', 'interactive session', 'discussion', 'group discussion',
    'two way communication', 'involved students', 'student engagement',
    'interactive teaching', 'passive class', 'one sided lecture', 'engaging class',
  ],

  Motivation: [
    'motivation', 'motivate', 'motivating', 'inspire', 'inspiring', 'inspired',
    'encourage', 'encouraging', 'demotivating', 'confidence boost', 'morale',
    'positive energy', 'enthusiasm', 'passionate', 'passion for teaching',
    'uplifting', 'discouraging', 'boosted confidence',
  ],

  Availability: [
    'availability', 'available', 'accessible', 'reachable', 'response time',
    'quick response', 'slow response', 'always available', 'not available',
    'office hours', 'extra time given', 'after class support', 'email response',
    'unavailable', 'hard to reach', 'responsive',
  ],

  Assessment: [
    'assessment', 'evaluation', 'feedback given', 'grading fairness',
    'fair evaluation', 'unfair evaluation', 'assessment method',
    'continuous assessment', 'performance review', 'rubric', 'scoring',
    'assessment criteria', 'objective evaluation', 'biased grading',
  ],

  'Lab Facilities': [
    'lab facility', 'lab facilities', 'laboratory', 'computer lab', 'equipment',
    'lab equipment', 'infrastructure of lab', 'lab access', 'system availability',
    'software availability', 'lab maintenance', 'outdated systems',
    'lab environment', 'workstation', 'lab timing',
  ],

  Infrastructure: [
    'infrastructure', 'classroom facility', 'building', 'furniture', 'seating',
    'projector', 'whiteboard', 'air conditioning', 'ventilation', 'wifi',
    'internet connectivity', 'campus facility', 'washroom', 'cleanliness',
    'maintenance', 'physical infrastructure', 'facility quality',
  ],

  'Learning Experience': [
    'learning experience', 'overall learning', 'learning outcome',
    'knowledge gained', 'skill development', 'personal growth', 'learning curve',
    'enjoyable learning', 'valuable learning', 'meaningful experience',
    'productive session', 'enriching experience', 'learning journey',
  ],

  'Industry Relevance': [
    'industry relevance', 'industry standard', 'real world application',
    'industry exposure', 'current trends', 'market relevant', 'industry expert',
    'practical relevance', 'up to date', 'industry practice', 'case study',
    'industry example', 'real world scenario', 'relevant to job',
  ],

  'Coding Practice': [
    'coding', 'coding practice', 'programming', 'code review', 'debugging',
    'hands on coding', 'coding exercise', 'coding assignment', 'algorithm',
    'data structure', 'code quality', 'coding standards', 'pair programming',
    'live coding session', 'coding skills', 'problem solving',
  ],

  'Placement Training': [
    'placement', 'placement training', 'interview preparation', 'resume building',
    'mock interview', 'aptitude training', 'placement support', 'job readiness',
    'career guidance', 'placement assistance', 'campus placement',
    'interview skills', 'placement drive', 'job preparation',
  ],

  'Soft Skills': [
    'soft skills', 'communication skills training', 'teamwork', 'leadership',
    'personality development', 'confidence building', 'presentation skills training',
    'time management skills', 'interpersonal skills', 'group activity',
    'public speaking', 'collaboration', 'emotional intelligence',
  ],

  'Overall Satisfaction': [
    'overall', 'overall experience', 'satisfied', 'satisfaction', 'excellent',
    'outstanding', 'amazing', 'great', 'good', 'best', 'worst', 'poor',
    'disappointing', 'impressive', 'recommend', 'highly recommend', 'wonderful',
    'fantastic', 'awesome', 'helpful', 'very helpful', 'not helpful',
    'value for time', 'worth it', 'waste of time',
  ],
};

module.exports = keywordDictionary;
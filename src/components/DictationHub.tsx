import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Microphone, 
  ArrowLeft, 
  Play, 
  Clock, 
  BookOpen,
  Crown,
  Lightning,
  Target,
  MagnifyingGlass
} from '@phosphor-icons/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';

interface DictationTest {
  id: string;
  title: string;
  description: string;
  language: 'english' | 'hindi';
  font?: 'default' | 'krutidev' | 'mangal';
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'general' | 'exam' | 'professional';
  isFree: boolean;
  audioUrl: string;
  masterTranscript: string;
}

const sampleTests: DictationTest[] = [
  {
    id: '1',
    title: 'General English Dictation - Beginner',
    description: 'Simple sentences and common vocabulary for beginners',
    language: 'english',
    duration: 180,
    difficulty: 'easy',
    category: 'general',
    isFree: true,
    audioUrl: '/audio/english-easy-1.mp3',
    masterTranscript: 'The quick brown fox jumps over the lazy dog. This is a simple sentence for practicing English typing. Every day we should practice to improve our skills. Typing is an essential skill in the modern world.'
  },
  {
    id: '2',
    title: 'SSC CGL Dictation Practice',
    description: 'Official exam-style dictation for SSC CGL preparation',
    language: 'english',
    duration: 300,
    difficulty: 'medium',
    category: 'exam',
    isFree: false,
    audioUrl: '/audio/ssc-cgl-1.mp3',
    masterTranscript: 'The Government of India has announced several new initiatives to improve digital literacy across the country. These programs aim to provide equal opportunities for all citizens to access technology and develop essential digital skills.'
  },
  {
    id: '3',
    title: 'Hindi Dictation - KrutiDev',
    description: 'Practice Hindi typing with KrutiDev font',
    language: 'hindi',
    font: 'krutidev',
    duration: 240,
    difficulty: 'medium',
    category: 'general',
    isFree: true,
    audioUrl: '/audio/hindi-krutidev-1.mp3',
    masterTranscript: 'यह एक हिंदी टाइपिंग परीक्षण है। कृपया ध्यान से सुनें और टाइप करें। हर दिन अभ्यास करने से आपकी टाइपिंग की गति बढ़ेगी।'
  },
  {
    id: '4',
    title: 'High Court Stenographer Test',
    description: 'Advanced dictation for court stenographer preparation',
    language: 'english',
    duration: 420,
    difficulty: 'hard',
    category: 'exam',
    isFree: false,
    audioUrl: '/audio/court-steno-1.mp3',
    masterTranscript: 'In the matter of civil appeals, the court observed that procedural compliance is essential for maintaining judicial integrity. The appellant has failed to comply with the mandatory provisions outlined in the Civil Procedure Code.'
  },
  {
    id: '5',
    title: 'Professional Email Dictation',
    description: 'Business communication and professional vocabulary',
    language: 'english',
    duration: 180,
    difficulty: 'medium',
    category: 'professional',
    isFree: true,
    audioUrl: '/audio/professional-1.mp3',
    masterTranscript: 'Dear team, I am writing to inform you about the upcoming project deadline and the deliverables expected from each department. Please ensure that all reports are submitted by Friday evening.'
  },
  {
    id: '6',
    title: 'Hindi - Mangal Font Practice',
    description: 'Government exam style Hindi dictation with Mangal font',
    language: 'hindi',
    font: 'mangal',
    duration: 300,
    difficulty: 'hard',
    category: 'exam',
    isFree: false,
    audioUrl: '/audio/hindi-mangal-1.mp3',
    masterTranscript: 'भारत सरकार ने डिजिटल साक्षरता बढ़ाने के लिए कई नई योजनाएं शुरू की हैं। इन योजनाओं का उद्देश्य सभी नागरिकों को तकनीकी शिक्षा प्रदान करना है।'
  }
];

export function DictationHub() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'english' | 'hindi'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filteredTests = sampleTests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || test.language === selectedLanguage;
    const matchesDifficulty = selectedDifficulty === 'all' || test.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesLanguage && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'hard': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return '';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exam': return <Target className="h-4 w-4" />;
      case 'professional': return <Crown className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Microphone className="h-6 w-6 text-white" weight="fill" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dictation & Transcription</h1>
              <p className="text-muted-foreground">
                Practice audio dictation for typing exams and professional skills
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Tabs value={selectedLanguage} onValueChange={(v) => setSelectedLanguage(v as any)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="english">English</TabsTrigger>
                  <TabsTrigger value="hindi">Hindi</TabsTrigger>
                </TabsList>
              </Tabs>

              <Tabs value={selectedDifficulty} onValueChange={(v) => setSelectedDifficulty(v as any)}>
                <TabsList>
                  <TabsTrigger value="all">All Levels</TabsTrigger>
                  <TabsTrigger value="easy">Easy</TabsTrigger>
                  <TabsTrigger value="medium">Medium</TabsTrigger>
                  <TabsTrigger value="hard">Hard</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lightning weight="fill" className="text-yellow-500" />
            Free Practice Tests
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.filter(t => t.isFree).map(test => (
              <Card 
                key={test.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(`/dictation/${test.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      FREE
                    </Badge>
                    <Badge variant="outline" className={getDifficultyColor(test.difficulty)}>
                      {test.difficulty.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {test.title}
                  </CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {Math.floor(test.duration / 60)} min
                    </div>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(test.category)}
                      {test.category}
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {test.language === 'hindi' ? '🇮🇳 Hindi' : '🇬🇧 English'}
                    </Badge>
                  </div>
                  {test.language === 'hindi' && test.font && (
                    <Badge variant="secondary" className="mt-2">
                      {test.font === 'krutidev' ? 'KrutiDev' : 'Mangal'}
                    </Badge>
                  )}
                  <Button className="w-full mt-4 group-hover:bg-primary/90" size="sm">
                    <Play weight="fill" className="mr-2 h-4 w-4" />
                    Start Test
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Crown weight="fill" className="text-yellow-500" />
            Exam & Professional Tests
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.filter(t => !t.isFree).map(test => (
              <Card 
                key={test.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group border-primary/20"
                onClick={() => navigate(`/dictation/${test.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                      PREMIUM
                    </Badge>
                    <Badge variant="outline" className={getDifficultyColor(test.difficulty)}>
                      {test.difficulty.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {test.title}
                  </CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {Math.floor(test.duration / 60)} min
                    </div>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(test.category)}
                      {test.category}
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {test.language === 'hindi' ? '🇮🇳 Hindi' : '🇬🇧 English'}
                    </Badge>
                  </div>
                  {test.language === 'hindi' && test.font && (
                    <Badge variant="secondary" className="mt-2">
                      {test.font === 'krutidev' ? 'KrutiDev' : 'Mangal'}
                    </Badge>
                  )}
                  <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90" size="sm">
                    <Play weight="fill" className="mr-2 h-4 w-4" />
                    Start Test
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { sampleTests };

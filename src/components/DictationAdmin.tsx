import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, Trash, Check, FileAudio } from '@phosphor-icons/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface DictationUpload {
  title: string;
  description: string;
  language: 'english' | 'hindi';
  font: 'default' | 'krutidev' | 'mangal';
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'general' | 'exam' | 'professional';
  isFree: boolean;
  audioFile: File | null;
  masterTranscript: string;
  duration: number;
}

export function DictationAdmin() {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState<DictationUpload[]>([]);
  const [currentUpload, setCurrentUpload] = useState<DictationUpload>({
    title: '',
    description: '',
    language: 'english',
    font: 'default',
    difficulty: 'medium',
    category: 'general',
    isFree: true,
    audioFile: null,
    masterTranscript: '',
    duration: 0
  });

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.addEventListener('loadedmetadata', () => {
        setCurrentUpload(prev => ({
          ...prev,
          audioFile: file,
          duration: Math.floor(audio.duration)
        }));
      });
    }
  };

  const handleAddTest = () => {
    if (!currentUpload.title || !currentUpload.audioFile || !currentUpload.masterTranscript) {
      alert('Please fill all required fields');
      return;
    }

    setUploads([...uploads, currentUpload]);
    setCurrentUpload({
      title: '',
      description: '',
      language: 'english',
      font: 'default',
      difficulty: 'medium',
      category: 'general',
      isFree: true,
      audioFile: null,
      masterTranscript: '',
      duration: 0
    });
  };

  const handleRemoveTest = (index: number) => {
    setUploads(uploads.filter((_, i) => i !== index));
  };

  const handleSaveAll = () => {
    // In production, this would send data to backend API
    console.log('Saving tests:', uploads);
    alert(`${uploads.length} dictation tests saved successfully!`);
    setUploads([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Dictation Test Admin</h1>
          <p className="text-muted-foreground">
            Upload audio files and master transcripts for dictation tests
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Dictation Test</CardTitle>
              <CardDescription>Fill in the details and upload audio file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Test Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., SSC Stenographer Practice Test"
                    value={currentUpload.title}
                    onChange={(e) => setCurrentUpload({ ...currentUpload, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the test..."
                    value={currentUpload.description}
                    onChange={(e) => setCurrentUpload({ ...currentUpload, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Test Configuration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={currentUpload.language}
                    onValueChange={(value: 'english' | 'hindi') => 
                      setCurrentUpload({ ...currentUpload, language: value })
                    }
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {currentUpload.language === 'hindi' && (
                  <div>
                    <Label htmlFor="font">Font</Label>
                    <Select
                      value={currentUpload.font}
                      onValueChange={(value: any) => 
                        setCurrentUpload({ ...currentUpload, font: value })
                      }
                    >
                      <SelectTrigger id="font">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="krutidev">KrutiDev</SelectItem>
                        <SelectItem value="mangal">Mangal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={currentUpload.difficulty}
                    onValueChange={(value: any) => 
                      setCurrentUpload({ ...currentUpload, difficulty: value })
                    }
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={currentUpload.category}
                    onValueChange={(value: any) => 
                      setCurrentUpload({ ...currentUpload, category: value })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={currentUpload.isFree}
                  onChange={(e) => setCurrentUpload({ ...currentUpload, isFree: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isFree" className="cursor-pointer">
                  Free Trial Test
                </Label>
              </div>

              <Separator />

              {/* Audio Upload */}
              <div>
                <Label htmlFor="audio">Audio File *</Label>
                <div className="mt-2">
                  <label 
                    htmlFor="audio"
                    className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-primary transition-colors"
                  >
                    {currentUpload.audioFile ? (
                      <div className="text-center">
                        <FileAudio className="h-12 w-12 mx-auto mb-2 text-green-500" weight="fill" />
                        <p className="font-medium">{currentUpload.audioFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Duration: {Math.floor(currentUpload.duration / 60)}:{String(currentUpload.duration % 60).padStart(2, '0')}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="font-medium">Click to upload audio</p>
                        <p className="text-sm text-muted-foreground">MP3, WAV, or OGG</p>
                      </div>
                    )}
                  </label>
                  <input
                    id="audio"
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Master Transcript */}
              <div>
                <Label htmlFor="transcript">Master Transcript *</Label>
                <Textarea
                  id="transcript"
                  placeholder="Type or paste the exact transcript of the audio..."
                  value={currentUpload.masterTranscript}
                  onChange={(e) => setCurrentUpload({ ...currentUpload, masterTranscript: e.target.value })}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {currentUpload.masterTranscript.split(/\s+/).filter(w => w).length} words
                </p>
              </div>

              <Button 
                onClick={handleAddTest} 
                className="w-full"
                size="lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Test to Queue
              </Button>
            </CardContent>
          </Card>

          {/* Queue List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Queue ({uploads.length})</CardTitle>
                <CardDescription>Tests ready to be saved</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {uploads.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No tests in queue
                  </div>
                ) : (
                  <>
                    {uploads.map((upload, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{upload.title}</h4>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {upload.language}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {upload.difficulty}
                              </Badge>
                              {upload.isFree && (
                                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600">
                                  Free
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {Math.floor(upload.duration / 60)} min • {upload.masterTranscript.split(/\s+/).filter(w => w).length} words
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTest(index)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                    
                    <Button 
                      onClick={handleSaveAll}
                      className="w-full mt-4"
                      size="lg"
                      variant="default"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Save All Tests
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Tests:</span>
                  <span className="font-medium">{uploads.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Free Tests:</span>
                  <span className="font-medium">{uploads.filter(u => u.isFree).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Premium Tests:</span>
                  <span className="font-medium">{uploads.filter(u => !u.isFree).length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

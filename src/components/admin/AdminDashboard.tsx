import { useState, useEffect } from 'react';
import { Card } from '../ui/base/card';
import { Button } from '../ui/base/button';
import { Badge } from '../ui/base/badge';
import WeeklyQuizManager from './WeeklyQuizManager';

interface QuizItem {
  id: number;
  quiz_id: number;
  title: string;
  week_id: string;
  created_at: string;
}

interface WeeklyQuiz {
  week_label: string;
  week_id: string;
  quiz_ids: number[];
  quizzes: QuizItem[];
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [weeklyQuizzes, setWeeklyQuizzes] = useState<WeeklyQuiz[]>([]);
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeeklyQuizzes();
  }, []);

  const fetchWeeklyQuizzes = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/quizzes/weekly?max_weeks=52', {
        headers: {
          'accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch weekly quizzes');
      }
      
      const data: WeeklyQuiz[] = await response.json();
      setWeeklyQuizzes(data);
    } catch (err) {
      console.error('Error fetching weekly quizzes:', err);
      setError('Failed to load weekly quizzes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenType');
    localStorage.removeItem('adminTokenExpiry');
    onLogout();
  };

  if (selectedWeekId) {
    const selectedWeek = weeklyQuizzes.find(w => w.week_id === selectedWeekId);
    if (!selectedWeek) return null;
    
    return (
      <WeeklyQuizManager
        weekLabel={selectedWeek.week_label}
        weekId={selectedWeek.week_id}
        quizIds={selectedWeek.quiz_ids}
        onBack={() => setSelectedWeekId(null)}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-purple-100">
      <Button
        onClick={handleLogout}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-md hover:shadow-lg z-50 px-4 py-2 text-sm font-medium text-gray-700"
      >
        Logout
      </Button>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your weekly quizzes and questions</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Weekly Quizzes Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading weekly quizzes...</p>
          </div>
        ) : weeklyQuizzes.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 text-lg">No weekly quizzes found</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklyQuizzes.map((week) => (
              <Card 
                key={week.week_id}
                className="p-6 bg-white/70 backdrop-blur-xl rounded-2xl border-0 hover:shadow-lg transition cursor-pointer transform hover:scale-105"
                onClick={() => setSelectedWeekId(week.week_id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{week.week_label}</h3>
                  <Badge className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    {week.quizzes.length} quizzes
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  <p>Week ID: {week.week_id}</p>
                </div>

                <Button 
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg shadow-lg transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedWeekId(week.week_id);
                  }}
                >
                  Manage Week
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        {!isLoading && (
          <div className="text-center mt-8">
            <Button 
              onClick={fetchWeeklyQuizzes}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition"
            >
              Refresh Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

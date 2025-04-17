import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, ChevronLeft, ChevronRight, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type AuthTab = 'login' | 'register';
type RegisterStep = 'basic' | 'interests' | 'activities';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  selectedInterests: string[];
  selectedActivities: string[];
}

const interests = [
  "등산", "요가", "독서", "골프", "음악감상", "여행", 
  "댄스", "임영웅", "요리", "바둑", "산책", "사진",
  "수영", "명상", "그림", "노래", "악기연주", "공예"
];

const activities = [
  "아침 요가 모임", "등산 모임", "독서 토론회",
  "골프 동호회", "헤비메탈 연주회", "국내여행 동호회",
  "라인댄스 수업", "도시농부 모임", "건강요리 교실",
  "바둑 동호회", "사진 촬영 모임", "아침 산책",
  "실버 수영 클럽", "마음챙김 명상", "화성 탐사"
];

function AuthModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [registerStep, setRegisterStep] = useState<RegisterStep>('basic');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    selectedInterests: [],
    selectedActivities: []
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await login(loginData.email, loginData.password);
      onClose();
      navigate('/profile');
    } catch (error) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (registerStep === 'basic') {
      if (!registerData.name || !registerData.email || !registerData.password || !registerData.passwordConfirm) {
        setError('모든 필드를 입력해주세요.');
        return;
      }

      if (registerData.password.length < 6) {
        setError('비밀번호는 최소 6자 이상이어야 합니다.');
        return;
      }

      if (registerData.password !== registerData.passwordConfirm) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
      }

      setError(null);
      setRegisterStep('interests');
    } else if (registerStep === 'interests') {
      if (registerData.selectedInterests.length < 3) {
        setError('최소 3개의 관심사를 선택해주세요.');
        return;
      }
      setError(null);
      setRegisterStep('activities');
    } else {
      try {
        setIsSubmitting(true);
        setError(null);
        await register(registerData.email, registerData.password, registerData.name);
        onClose();
        navigate('/profile');
      } catch (error: any) {
        if (error.message === 'rate_limit_exceeded') {
          setError('잠시 후 다시 시도해주세요.');
        } else if (error.message.includes('email')) {
          setError('이미 사용중인 이메일입니다.');
        } else {
          setError('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const toggleInterest = (interest: string) => {
    setRegisterData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter(i => i !== interest)
        : [...prev.selectedInterests, interest]
    }));
  };

  const toggleActivity = (activity: string) => {
    setRegisterData(prev => ({
      ...prev,
      selectedActivities: prev.selectedActivities.includes(activity)
        ? prev.selectedActivities.filter(a => a !== activity)
        : [...prev.selectedActivities, activity]
    }));
  };

  const handleBack = () => {
    setError(null);
    if (registerStep === 'interests') {
      setRegisterStep('basic');
    } else if (registerStep === 'activities') {
      setRegisterStep('interests');
    }
  };

  const inputClasses = "w-full pl-14 pr-4 py-4 text-xl text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        )}

        {/* Tabs */}
        {registerStep === 'basic' && (
          <div className="flex gap-4 mb-8 text-2xl">
            <button
              onClick={() => {
                setActiveTab('login');
                setRegisterStep('basic');
                setError(null);
              }}
              className={`pb-2 px-4 font-bold ${
                activeTab === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setRegisterStep('basic');
                setError(null);
              }}
              className={`pb-2 px-4 font-bold ${
                activeTab === 'register'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
            >
              회원가입
            </button>
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label htmlFor="login-email" className="block text-xl font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="email"
                  id="login-email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  className={inputClasses}
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xl font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="password"
                  id="login-password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className={inputClasses}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white text-xl font-semibold py-4 rounded-lg transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>

            <p className="text-center text-gray-600 text-lg">
              비밀번호를 잊으셨나요?{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                비밀번호 찾기
              </button>
            </p>
          </form>
        )}

        {/* Register Forms */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {registerStep === 'basic' && (
              <>
                <div>
                  <label htmlFor="name" className="block text-xl font-medium text-gray-700 mb-2">
                    이름
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                      className={inputClasses}
                      placeholder="홍길동"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xl font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      className={inputClasses}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xl font-medium text-gray-700 mb-2">
                    비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input
                      type="password"
                      id="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      className={inputClasses}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">비밀번호는 최소 6자 이상이어야 합니다</p>
                </div>

                <div>
                  <label htmlFor="password-confirm" className="block text-xl font-medium text-gray-700 mb-2">
                    비밀번호 확인
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input
                      type="password"
                      id="password-confirm"
                      value={registerData.passwordConfirm}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, passwordConfirm: e.target.value }))}
                      className={inputClasses}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Interests Selection */}
            {registerStep === 'interests' && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">관심사를 선택해주세요</h3>
                  <p className="text-gray-600 text-lg">
                    관심 있는 활동을 모두 선택해주세요 (최소 3개)
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`p-3 text-lg rounded-lg border-2 transition-colors ${
                        registerData.selectedInterests.includes(interest)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Step 3: Activities Selection */}
            {registerStep === 'activities' && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">참여하고 싶은 활동을 선택해주세요</h3>
                  <p className="text-gray-600 text-lg">
                    관심 있는 모임을 모두 선택해주세요
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {activities.map((activity) => (
                    <button
                      key={activity}
                      type="button"
                      onClick={() => toggleActivity(activity)}
                      className={`p-4 text-lg rounded-lg border-2 transition-colors ${
                        registerData.selectedActivities.includes(activity)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              {registerStep !== 'basic' && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 text-xl text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                  이전
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 bg-blue-600 text-white text-xl font-semibold px-8 py-4 rounded-lg transition-colors ${
                  registerStep === 'basic' ? 'w-full' : 'ml-auto'
                } ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isSubmitting && registerStep === 'activities' ? '가입 중...' : 
                  registerStep === 'activities' ? '가입완료' : '다음'}
                {registerStep !== 'activities' && <ChevronRight className="w-6 h-6" />}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-blue-600 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <h1 className="text-4xl font-bold">실버 소셜</h1>
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 text-xl hover:text-gray-200 transition-colors"
              >
                <UserCircle className="w-6 h-6" />
                내 정보
              </button>
              <button 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center gap-1 text-lg bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                로그아웃
              </button>
            </div>
          ) : (
            <button 
              className="text-2xl bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsAuthModalOpen(true)}
            >
              로그인
            </button>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}
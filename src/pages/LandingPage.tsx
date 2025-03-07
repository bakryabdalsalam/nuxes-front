import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon, 
  BuildingOfficeIcon, 
  GlobeAltIcon, 
  LightBulbIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { JobSearch } from '../components/JobSearch';

const features = [
  {
    name: 'Easy Job Search',
    description: 'Find your dream job with our powerful search and filtering system.',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Global Opportunities',
    description: 'Access job opportunities from companies around the world.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Smart Matching',
    description: 'Our AI-powered system matches you with the most relevant positions.',
    icon: LightBulbIcon,
  },
  {
    name: 'Track Applications',
    description: 'Keep track of all your job applications in one place.',
    icon: CheckCircleIcon,
  },
];

const stats = [
  { name: 'Active Jobs', value: '2,000+' },
  { name: 'Companies', value: '500+' },
  { name: 'Success Rate', value: '94%' },
  { name: 'Job Seekers', value: '10,000+' },
];

const categories = [
  { name: 'Technology', icon: BriefcaseIcon, jobCount: 732 },
  { name: 'Marketing', icon: BriefcaseIcon, jobCount: 294 },
  { name: 'Finance', icon: BriefcaseIcon, jobCount: 532 },
  { name: 'Healthcare', icon: BriefcaseIcon, jobCount: 621 },
  { name: 'Education', icon: BriefcaseIcon, jobCount: 402 },
  { name: 'Design', icon: BriefcaseIcon, jobCount: 204 },
];

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-full xl:w-1/2 h-full bg-gradient-to-br from-primary-50 to-secondary-50 opacity-30"></div>
        </div>
        <div className="relative mx-auto max-w-7xl pb-16 pt-10 sm:pb-24 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:pt-32">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <div className="mb-6">
                  <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
                    Nexues Job Board
                  </span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl bg-clip-text">
                  Find Your <span className="text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Dream Job</span> Today
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Connect with top employers and discover opportunities that match your skills and aspirations. 
                  Your next career move starts here.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center gap-y-4 gap-x-6">
                  <Link
                    to="/register"
                    className="w-full sm:w-auto rounded-md bg-primary-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/jobs"
                    className="text-sm font-semibold leading-6 text-gray-900 flex items-center hover:text-primary-600 transition-colors duration-200"
                  >
                    Browse Jobs <span className="ml-1 text-lg" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex lg:items-center">
            <div className="mx-auto w-full max-w-md px-6 sm:px-0 lg:max-w-none">
              <div className="relative">
                {/* Decorative blobs */}
                <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary-200 opacity-20 mix-blend-multiply blur-3xl"></div>
                <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-secondary-200 opacity-20 mix-blend-multiply blur-3xl"></div>
                
                {/* Search Card */}
                <div className="relative bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold mb-4">Find Your Next Opportunity</h2>
                  <JobSearch />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Browse by Category
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Explore Jobs by Industry
            </p>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Find the perfect role in your field of expertise
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-2 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {categories.map((category) => (
              <Link to={`/jobs?category=${category.name}`} key={category.name}>
                <div className="group relative bg-white p-6 focus:outline-none hover:bg-primary-50 transition-colors duration-300 rounded-xl shadow-soft hover:shadow-hover border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700">{category.name}</h3>
                      <p className="mt-1.5 text-sm text-gray-500">{category.jobCount} open positions</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-300">
                      <category.icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Find Jobs Faster
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to find your next role
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform provides all the tools and features you need to make your job search 
              efficient and successful.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div key={feature.name} className="relative bg-white p-6 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300">
                  <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by job seekers and companies worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Join thousands of professionals who have found their perfect role through our platform
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white px-8 py-10 rounded-xl shadow-soft text-center">
                  <dt className="text-base font-medium text-gray-600">{stat.name}</dt>
                  <dd className="mt-3 text-4xl font-bold tracking-tight text-primary-600">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Companies Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Top companies trust Nexues
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                Partner with top employers worldwide who use our platform to find qualified candidates for their open positions.
              </p>
              <div className="mt-10">
                <Link
                  to="/companies"
                  className="text-primary-600 font-semibold flex items-center hover:text-primary-800 transition-colors"
                >
                  View all partner companies
                  <span className="ml-2" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-center">
                  <div className="h-12 w-28 bg-gray-100 rounded-md flex items-center justify-center">
                    <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gradient-to-br from-primary-600 to-secondary-700 px-6 py-16 sm:py-24 text-center shadow-xl sm:rounded-2xl sm:px-16">
            <div className="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-white opacity-10 mix-blend-multiply blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-white opacity-10 mix-blend-multiply blur-3xl"></div>
            
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start your job search today
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white text-opacity-90">
              Create your account now to access thousands of job opportunities and take the next step in your career.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/register"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-primary-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 shadow-sm transition-colors duration-200"
              >
                Create Account
              </Link>
              <Link
                to="/jobs"
                className="text-base font-semibold text-white hover:text-white/90 transition-colors duration-200 flex items-center"
              >
                Browse Jobs <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
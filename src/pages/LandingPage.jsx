import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Activity, Trophy, LineChart } from 'lucide-react';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const features = [
    { icon: Activity, title: 'Carbon Tracking', desc: 'Track daily emissions from transport, energy, and lifestyle.' },
    { icon: Leaf, title: 'Smart Recommendations', desc: 'Receive personalized suggestions to reduce your footprint.' },
    { icon: LineChart, title: 'Progress Dashboard', desc: 'Visualize trends and improvements over time.' },
    { icon: Trophy, title: 'Green Challenges', desc: 'Participate in sustainability activities and earn points.' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-3xl mx-auto">
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Leaf className="w-12 h-12 text-green-500" />
            </div>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            Know Your Impact. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">Shape a Greener Future.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-300 mb-10">
            Track your carbon footprint, receive personalized insights, complete sustainability challenges, and build eco-friendly habits through smart recommendations.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/calculator" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-green-500 hover:bg-green-600 rounded-full transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200">
              Calculate Footprint
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/dashboard" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-green-700 bg-green-50 hover:bg-green-100 dark:bg-slate-800 dark:text-green-400 dark:hover:bg-slate-700 rounded-full transition-colors">
              Go to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Powerful Tools for Sustainability</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300 group">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;


import { useState } from 'react';
import { Check } from 'lucide-react';

type FormMode = 'waitlist' | 'skip';

interface FormData {
  name: string;
  email: string;
  referralCode?: string;
  paymentMethod?: string;
}

const WaitlistForm = () => {
  const [formMode, setFormMode] = useState<FormMode>('waitlist');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleModeChange = (mode: FormMode) => {
    setFormMode(mode);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };
  
  return (
    <section id="waitlist" className="py-24 relative">
      {/* Background Elements */}
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-galaxy-accent/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto glass-card rounded-2xl overflow-hidden">
          {!submitted ? (
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  {formMode === 'waitlist' 
                    ? 'Join Our Waitlist' 
                    : 'Skip the Waitlist'}
                </h2>
                <p className="text-gray-300">
                  {formMode === 'waitlist' 
                    ? 'Be among the first to experience Awaken Ambience.' 
                    : 'Get guaranteed early access to Awaken Ambience.'}
                </p>
              </div>
              
              <div className="flex rounded-lg mb-8 bg-galaxy-purple/20">
                <button
                  type="button"
                  className={`flex-1 py-3 text-center rounded-lg transition-all ${
                    formMode === 'waitlist' 
                      ? 'bg-galaxy-accent text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={() => handleModeChange('waitlist')}
                >
                  Join Waitlist
                </button>
                <button
                  type="button"
                  className={`flex-1 py-3 text-center rounded-lg transition-all ${
                    formMode === 'skip' 
                      ? 'bg-galaxy-accent text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={() => handleModeChange('skip')}
                >
                  Skip the Line
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-galaxy-purple/20 border border-galaxy-accent/20 rounded-lg focus:ring-2 focus:ring-galaxy-accent/50 focus:border-transparent transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-galaxy-purple/20 border border-galaxy-accent/20 rounded-lg focus:ring-2 focus:ring-galaxy-accent/50 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  {formMode === 'waitlist' && (
                    <div>
                      <label htmlFor="referralCode" className="block text-sm font-medium mb-1">
                        Referral Code <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        id="referralCode"
                        name="referralCode"
                        type="text"
                        value={formData.referralCode || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-galaxy-purple/20 border border-galaxy-accent/20 rounded-lg focus:ring-2 focus:ring-galaxy-accent/50 focus:border-transparent transition-all"
                        placeholder="Enter referral code if you have one"
                      />
                    </div>
                  )}
                  
                  {formMode === 'skip' && (
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Payment Method
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border border-galaxy-accent/20 rounded-lg cursor-pointer hover:bg-galaxy-purple/30 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="creditCard"
                            checked={formData.paymentMethod === 'creditCard'}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            formData.paymentMethod === 'creditCard' 
                              ? 'border-galaxy-accent' 
                              : 'border-gray-400'
                          }`}>
                            {formData.paymentMethod === 'creditCard' && (
                              <div className="w-2.5 h-2.5 rounded-full bg-galaxy-accent"></div>
                            )}
                          </div>
                          <div className="flex-1">Credit Card</div>
                        </label>
                        
                        <label className="flex items-center p-4 border border-galaxy-accent/20 rounded-lg cursor-pointer hover:bg-galaxy-purple/30 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={formData.paymentMethod === 'paypal'}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            formData.paymentMethod === 'paypal' 
                              ? 'border-galaxy-accent' 
                              : 'border-gray-400'
                          }`}>
                            {formData.paymentMethod === 'paypal' && (
                              <div className="w-2.5 h-2.5 rounded-full bg-galaxy-accent"></div>
                            )}
                          </div>
                          <div className="flex-1">PayPal</div>
                        </label>
                        
                        <label className="flex items-center p-4 border border-galaxy-accent/20 rounded-lg cursor-pointer hover:bg-galaxy-purple/30 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="crypto"
                            checked={formData.paymentMethod === 'crypto'}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            formData.paymentMethod === 'crypto' 
                              ? 'border-galaxy-accent' 
                              : 'border-gray-400'
                          }`}>
                            {formData.paymentMethod === 'crypto' && (
                              <div className="w-2.5 h-2.5 rounded-full bg-galaxy-accent"></div>
                            )}
                          </div>
                          <div className="flex-1">Cryptocurrency</div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full primary-button flex items-center justify-center"
                  disabled={loading || (formMode === 'skip' && !formData.paymentMethod)}
                >
                  {loading ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    formMode === 'waitlist' ? 'Join Waitlist' : 'Secure Your Spot • $500'
                  )}
                </button>
                
                <p className="text-xs text-gray-400 mt-4 text-center">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-galaxy-accent/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-galaxy-accent" />
              </div>
              
              <h2 className="text-2xl font-bold mb-4">
                {formMode === 'waitlist' 
                  ? 'You\'re on the waitlist!' 
                  : 'Payment Successful!'}
              </h2>
              
              <p className="text-gray-300 mb-8">
                {formMode === 'waitlist' 
                  ? 'We\'ve added you to our waitlist. We\'ll notify you when Awaken Ambience is ready.' 
                  : 'Congratulations! You\'ll receive priority access when Awaken Ambience launches. Check your email for details.'}
              </p>
              
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="secondary-button"
              >
                Back to Form
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WaitlistForm;

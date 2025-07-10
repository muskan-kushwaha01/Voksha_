import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon. (धन्यवाद! हम जल्द ही आपसे संपर्क करेंगे। )');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-container">
      <h2>Contact Us (संपर्क करें)</h2>
      <p>We'd love to hear from you! Get in touch with us for any questions or support.</p>
      <p>किसी भी प्रश्न या सहायता के लिए हमसे संपर्क करें।</p>
      
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name/आपका नाम"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email/आपका ईमेल"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          
          <textarea
            id="message"
            name="message"
            placeholder="Your Message/आपका संदेश"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
          ></textarea>
        </div>
        
        <button type="submit" className="submit-btn">Send Message (संदेश भेजे)</button>
      </form>
      

      <div className="contact-info">
        <h3>Other Ways to Reach Us (हम तक पहुँचने के अन्य तरीके)</h3>
        <p>📧 Email (ईमेल): support@empowerai.com</p>
        <p>📞 Phone (फ़ोन): +91 **********</p>
        <p>📍 Address (पता) : New Delhi, India</p>
      </div>
    </div>
  );
};

export default Contact;
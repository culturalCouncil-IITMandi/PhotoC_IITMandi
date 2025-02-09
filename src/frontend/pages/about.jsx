import React from "react";

const About = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <h1>About Us</h1>
      
      <div style={{ textAlign: "left", marginTop: "20px" }}>
        <h2>Developer</h2>
        <p><strong>Divyansh Jindal</strong></p>
        <p>Email: <a href="mailto:b24121@students.iitmandi.ac.in">b24121@students.iitmandi.ac.in</a></p>
        <p>Phone: +91 76260 40100</p>
      </div>

      <div style={{ textAlign: "left", marginTop: "20px" }}>
        <h2>Cultural Secretary</h2>
        <p><strong>Vivek Aggrawal</strong></p>
        <p>Email: <a href="mailto:cultural_secretary@students.iitmandi.ac.in">cultural_secretary@students.iitmandi.ac.in</a></p>
        <p>Phone: +91 941780 99100</p>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Our Location</h2>
        <iframe
          title="IIT Mandi Location"
          width="100%"
          height="300"
          frameBorder="0"
          style={{ border: "0", borderRadius: "8px" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d3391.5589766691!2d76.99657057642452!3d31.782512574095023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3904e5ca553f4a27%3A0xe0c4d446cc9584ca!2sQXMX%2B2M2%20IIT-Mandi%20(North%20Campus)%2C%20Khanahr%2C%20Kamand%2C%20Himachal%20Pradesh%20175005!3m2!1d31.782512599999997!2d76.9991455!5e0!3m2!1sen!2sin!4v1739101004547!5m2!1sen!2sin"
        ></iframe>
      </div>
    </div>
  );
};

export default About;

import React, { useState, useEffect } from 'react';
import { imageData, getRandomImages, getImagesByCategory } from './imageData';
import './AILearning.css';

const ImageGallery = ({ prompt, category, count = 1 }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate AI image generation with a delay
    setLoading(true);
    
    setTimeout(() => {
      let selectedImages;
      
      // If a category is specified, get images from that category
      if (category && category.trim() !== '') {
        selectedImages = getImagesByCategory(category.toLowerCase(), count);
      } 
      // If no category but we have a prompt, try to match keywords
      else if (prompt && prompt.trim() !== '') {
        const lowercasePrompt = prompt.toLowerCase();
        const keywords = {
          nature: ['nature', 'mountain', 'forest', 'ocean', 'beach', 'tree', 'landscape', 'sky', 'water'],
          animals: ['animal', 'cat', 'dog', 'bird', 'wildlife', 'pet', 'lion', 'tiger', 'elephant'],
          technology: ['tech', 'computer', 'digital', 'robot', 'ai', 'future', 'code', 'machine', 'device'],
          architecture: ['building', 'architecture', 'house', 'city', 'structure', 'design', 'construction'],
          abstract: ['abstract', 'art', 'pattern', 'creative', 'shape', 'color', 'geometric']
        };
        
        // Find matching category based on keywords in prompt
        let matchedCategory = null;
        for (const [cat, terms] of Object.entries(keywords)) {
          if (terms.some(term => lowercasePrompt.includes(term))) {
            matchedCategory = cat;
            break;
          }
        }
        
        if (matchedCategory) {
          selectedImages = getImagesByCategory(matchedCategory, count);
        } else {
          // Default to random if no category match
          selectedImages = getRandomImages(count);
        }
      } 
      // If no prompt or category, get random images
      else {
        selectedImages = getRandomImages(count);
      }
      
      // Add attribution and "AI generated" labels
      const processedImages = selectedImages.map(img => ({
        ...img,
        isGenerated: true,
        generatedFrom: prompt || "AI image generation"
      }));
      
      setImages(processedImages);
      setLoading(false);
    }, 1500); // Simulate AI generation time
  }, [prompt, category, count]);
  
  if (loading) {
    return (
      <div className="image-gallery-loading">
        <div className="spinner"></div>
        <p>Generating images with AI...</p>
      </div>
    );
  }
  
  return (
    <div className="image-gallery">
      {images.map(image => (
        <div key={image.id} className="image-card">
          <div className="image-container">
            <img 
              src={`${image.url}?auto=format&fit=crop&w=800&q=80`} 
              alt={image.name} 
              loading="lazy"
            />
            <div className="image-overlay">
              <span className="ai-generated-badge">AI Generated</span>
            </div>
          </div>
          <div className="image-info">
            <h3>{image.name}</h3>
            <p>{image.description}</p>
            <small>Based on: {image.generatedFrom}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery; 
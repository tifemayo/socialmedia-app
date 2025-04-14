const natural = require('natural');
const stopword = require('stopword');
const TfIdf = require('tf-idf-search');
const kmeans = require('node-kmeans');

// Tokenizer and stemmer
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Preprocess text: lowercase, tokenize, remove stopwords, stem
const preprocessText = (text) => {
  if (!text) return [];
  const lowercase = text.toLowerCase();
  const tokens = tokenizer.tokenize(lowercase);
  const withoutStopwords = stopword.removeStopwords(tokens);
  return withoutStopwords.map(token => stemmer.stem(token));
};

// TF-IDF for keyword relevance
const calculateTfIdf = (documents) => {
  const tfidf = new TfIdf();
  
  // Add all documents to the TF-IDF model
  documents.forEach((doc, index) => {
    const processedText = preprocessText(doc.desc).join(' ');
    tfidf.addDocument(processedText, index);
  });
  
  return tfidf;
};

// K-means clustering for topic modeling
const clusterDocuments = async (documents, k = 5) => {
  // Create document vectors
  const vectors = documents.map(doc => {
    const processedText = preprocessText(doc.desc);
    // Create a simple bag-of-words vector
    // In a real application, you might want to use word embeddings
    return processedText.map(word => word.length); // Simple feature
  });
  
  // Run k-means
  try {
    const result = await new Promise((resolve, reject) => {
      kmeans.clusterize(vectors, { k }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    
    // Assign cluster to each document
    documents.forEach((doc, i) => {
      const clusterIndex = result.findIndex(cluster => 
        cluster.clusterInd.includes(i)
      );
      doc.cluster = clusterIndex;
    });
    
    return documents;
  } catch (error) {
    console.error('Clustering error:', error);
    return documents.map(doc => ({ ...doc, cluster: 0 }));
  }
};

// Content-based recommendation
const getRecommendations = (post, allPosts, limit = 5) => {
  // Simple similarity based on shared words
  const postWords = new Set(preprocessText(post.desc));
  
  return allPosts
    .filter(p => p.id !== post.id) // Exclude the current post
    .map(otherPost => {
      const otherWords = new Set(preprocessText(otherPost.desc));
      
      // Calculate Jaccard similarity
      const intersection = new Set([...postWords].filter(x => otherWords.has(x)));
      const union = new Set([...postWords, ...otherWords]);
      
      const similarity = intersection.size / union.size;
      
      return {
        ...otherPost,
        similarity
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
};

module.exports = {
  preprocessText,
  calculateTfIdf,
  clusterDocuments,
  getRecommendations
};
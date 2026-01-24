import arrayDiagram from '../assets/diagrams/array.svg';
import stackDiagram from '../assets/diagrams/stack.svg';
import linkedListDiagram from '../assets/diagrams/linked-list.svg';
import treeDiagram from '../assets/diagrams/tree.svg';
import queueDiagram from '../assets/diagrams/queue.svg';
import hashMapDiagram from '../assets/diagrams/hash-map.svg';
import recursionDiagram from '../assets/diagrams/recursion.svg';
import sortingDiagram from '../assets/diagrams/sorting.svg';
import graphDiagram from '../assets/diagrams/graph.svg';
import loopDiagram from '../assets/diagrams/loop.svg';
import defaultDiagram from '../assets/diagrams/default.svg';

// Generate diagram URLs using QuickChart and Mermaid syntax
export const generateDiagramUrl = (topic) => {
  const topic_lower = topic.toLowerCase();
  
  // Choose the right diagram type based on the topic
  let diagram = '';
  
  if (topic_lower.includes('array') || topic_lower.includes('list')) {
    // Array diagram
    diagram = `graph LR
      A[Index 0] --- B[Index 1] --- C[Index 2] --- D[Index 3] --- E[...] --- F[Index n]
      style A fill:#4D61FC,color:white
      style B fill:#4D61FC,color:white
      style C fill:#4D61FC,color:white
      style D fill:#4D61FC,color:white
      style F fill:#4D61FC,color:white`;
  } 
  else if (topic_lower.includes('stack')) {
    // Stack diagram
    diagram = `graph TD
      A[Top: Last In] --> B[Element] --> C[Element] --> D[Bottom: First In]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white
      style D fill:#7D91FC,color:white`;
  }
  else if (topic_lower.includes('queue')) {
    // Queue diagram
    diagram = `graph LR
      A[First In] --> B[Element] --> C[Element] --> D[Last In]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white
      style D fill:#7D91FC,color:white`;
  }
  else if (topic_lower.includes('tree') || topic_lower.includes('binary')) {
    // Binary tree diagram
    diagram = `graph TD
      A[Root] --> B[Left Child] & C[Right Child]
      B --> D[Left Grandchild] & E[Right Grandchild]
      C --> F[Left Grandchild] & G[Right Grandchild]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#5D71FC,color:white`;
  }
  else if (topic_lower.includes('hash') || topic_lower.includes('map') || topic_lower.includes('dict')) {
    // Hash map diagram
    diagram = `graph TD
      A[Hash Table] --> B[Bucket 0] & C[Bucket 1] & D[Bucket 2] & E[...]
      B --> F[Key-Value]
      C --> G[Key-Value] --> H[Key-Value]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#5D71FC,color:white
      style D fill:#5D71FC,color:white`;
  }
  else if (topic_lower.includes('linked')) {
    // Linked list diagram
    diagram = `graph LR
      A[Head] --> B[Node] --> C[Node] --> D[Node] --> E[Null]
      B -- Data --> F[Value 1]
      C -- Data --> G[Value 2]
      D -- Data --> H[Value 3]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white
      style D fill:#7D91FC,color:white`;
  }
  else if (topic_lower.includes('recursion')) {
    // Recursion diagram
    diagram = `graph TD
      A[Function Call] --> B[Function Call] --> C[Function Call] --> D[Base Case]
      D --> E[Return] --> F[Return] --> G[Return]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white
      style D fill:#7D91FC,color:white`;
  }
  else if (topic_lower.includes('sort') || topic_lower.includes('algorithm')) {
    // Sorting algorithm general diagram
    diagram = `graph TD
      A[Unsorted Array] --> B[Sorting Algorithm]
      B --> C[Sorted Array]
      B --> D{Compare} --> E[Swap] --> D
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white`;
  }
  else if (topic_lower.includes('graph')) {
    // Graph diagram
    diagram = `graph TD
      A((Node A)) --- B((Node B))
      A --- C((Node C))
      B --- D((Node D))
      C --- D
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white
      style D fill:#7D91FC,color:white`;
  }
  else if (topic_lower.includes('function') || topic_lower.includes('method')) {
    // Function diagram
    diagram = `graph LR
      A[Input] --> B[Function] --> C[Output]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white`;
  }
  else if (topic_lower.includes('variable') || topic_lower.includes('data type')) {
    // Variables and data types
    diagram = `graph TD
      A[Variables] --> B[Primitive Types] & C[Reference Types]
      B --> D[Numbers] & E[Strings] & F[Boolean]
      C --> G[Objects] & H[Arrays] & I[Functions]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#5D71FC,color:white`;
  }
  else if (topic_lower.includes('loop')) {
    // Loop diagram
    diagram = `graph TD
      A[Initialize] --> B{Condition}
      B -- True --> C[Body]
      C --> D[Update] --> B
      B -- False --> E[Exit Loop]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white
      style D fill:#7D91FC,color:white`;
  }
  else if (topic_lower.includes('class') || topic_lower.includes('object')) {
    // Object-oriented programming
    diagram = `graph TD
      A[Class] --> B[Attributes] & C[Methods]
      A --> D[Object 1] & E[Object 2]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#5D71FC,color:white
      style D fill:#6D81FC,color:white
      style E fill:#6D81FC,color:white`;
  }
  else {
    // Generic coding concept diagram
    diagram = `graph LR
      A[Input] --> B[Process] --> C[Output]
      style A fill:#4D61FC,color:white
      style B fill:#5D71FC,color:white
      style C fill:#6D81FC,color:white`;
  }
  
  // Use QuickChart to render the Mermaid diagram
  const encodedDiagram = encodeURIComponent(diagram);
  return `https://quickchart.io/mermaid?theme=dark&backgroundColor=transparent&width=500&height=300&mermaid=${encodedDiagram}`;
};

// Get a local diagram based on the topic
export const getLocalDiagram = (topic = '') => {
  const lowerTopic = topic.toLowerCase();
  
  if (lowerTopic.includes('array')) {
    return arrayDiagram;
  } else if (lowerTopic.includes('stack')) {
    return stackDiagram;
  } else if ((lowerTopic.includes('linked list') || lowerTopic.includes('linkedlist'))) {
    return linkedListDiagram;
  } else if ((lowerTopic.includes('tree') || lowerTopic.includes('binary'))) {
    return treeDiagram;
  } else if (lowerTopic.includes('queue')) {
    return queueDiagram;
  } else if ((lowerTopic.includes('hash') || lowerTopic.includes('map') || lowerTopic.includes('dictionary'))) {
    return hashMapDiagram;
  } else if ((lowerTopic.includes('recursion') || lowerTopic.includes('recursive'))) {
    return recursionDiagram;
  } else if ((lowerTopic.includes('sort') || lowerTopic.includes('sorting'))) {
    return sortingDiagram;
  } else if ((lowerTopic.includes('graph') || lowerTopic.includes('network'))) {
    return graphDiagram;
  } else if ((lowerTopic.includes('loop') || lowerTopic.includes('iteration') || lowerTopic.includes('for ') || lowerTopic.includes('while'))) {
    return loopDiagram;
  }
  
  return defaultDiagram;
};

// Get a direct diagram image URL based on the topic
export const getDiagramImage = (topic) => {
  const topic_lower = topic.toLowerCase();
  
  // Match topic to direct image URLs
  if (topic_lower.includes('array') || (topic_lower.includes('list') && !topic_lower.includes('linked'))) {
    return 'https://miro.medium.com/v2/resize:fit:1400/1*qYIvCT52gVSN-2qM3isrCQ.png';
  }
  else if (topic_lower.includes('stack')) {
    return 'https://media.geeksforgeeks.org/wp-content/uploads/20210716162942/stack-660x345.png';
  }
  else if (topic_lower.includes('queue')) {
    return 'https://media.geeksforgeeks.org/wp-content/uploads/20220805131014/fifo.png';
  }
  else if (topic_lower.includes('tree') || topic_lower.includes('binary')) {
    return 'https://miro.medium.com/v2/resize:fit:1400/1*ziYvZzrttGdwvBKj-ttMEg.png';
  }
  else if (topic_lower.includes('hash') || topic_lower.includes('map') || topic_lower.includes('dict')) {
    return 'https://www.researchgate.net/publication/329924304/figure/fig1/AS:705533396824064@1545223242567/An-example-of-hash-table-data-structure.png';
  }
  else if (topic_lower.includes('linked')) {
    return 'https://miro.medium.com/v2/resize:fit:1400/1*3c81U_Q7v1GZJ2jFgQS7zg.png';
  }
  else if (topic_lower.includes('recursion')) {
    return 'https://res.cloudinary.com/practicaldev/image/fetch/s--NLZJL6wD--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/kwo4e78tsoro3pb3k7hv.png';
  }
  else if (topic_lower.includes('sort') || topic_lower.includes('algorithm')) {
    return 'https://www.tutorialspoint.com/data_structures_algorithms/images/sorting_algorithms.jpg';
  }
  else if (topic_lower.includes('graph')) {
    return 'https://miro.medium.com/v2/resize:fit:1200/1*fzV-FQcQMCch6fvxLVEAig.png';
  }
  
  // Fallback to a general programming diagram
  return 'https://miro.medium.com/v2/resize:fit:1400/1*et-jDUkC5dAdYPUE3xYjVA.png';
}; 
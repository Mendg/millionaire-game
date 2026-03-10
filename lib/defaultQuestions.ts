import { Question } from '../types';

const defaultQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the capital city of France?',
    answers: {
      A: 'London',
      B: 'Berlin',
      C: 'Paris',
      D: 'Madrid',
    },
    correct: 'C',
  },
  {
    id: '2',
    question: 'How many sides does a hexagon have?',
    answers: {
      A: '5',
      B: '6',
      C: '7',
      D: '8',
    },
    correct: 'B',
  },
  {
    id: '3',
    question: 'Which planet is known as the Red Planet?',
    answers: {
      A: 'Jupiter',
      B: 'Venus',
      C: 'Saturn',
      D: 'Mars',
    },
    correct: 'D',
  },
  {
    id: '4',
    question: 'Who wrote the play "Romeo and Juliet"?',
    answers: {
      A: 'Charles Dickens',
      B: 'William Shakespeare',
      C: 'Jane Austen',
      D: 'Mark Twain',
    },
    correct: 'B',
  },
  {
    id: '5',
    question: 'What is the chemical symbol for gold?',
    answers: {
      A: 'Go',
      B: 'Gd',
      C: 'Au',
      D: 'Ag',
    },
    correct: 'C',
  },
  {
    id: '6',
    question: 'Which ocean is the largest in the world?',
    answers: {
      A: 'Atlantic Ocean',
      B: 'Indian Ocean',
      C: 'Arctic Ocean',
      D: 'Pacific Ocean',
    },
    correct: 'D',
  },
  {
    id: '7',
    question: 'In what year did World War II end?',
    answers: {
      A: '1943',
      B: '1944',
      C: '1945',
      D: '1946',
    },
    correct: 'C',
  },
  {
    id: '8',
    question: 'What is the speed of light approximately?',
    answers: {
      A: '300,000 km/s',
      B: '150,000 km/s',
      C: '450,000 km/s',
      D: '600,000 km/s',
    },
    correct: 'A',
  },
  {
    id: '9',
    question: 'Which element has the atomic number 1?',
    answers: {
      A: 'Helium',
      B: 'Oxygen',
      C: 'Carbon',
      D: 'Hydrogen',
    },
    correct: 'D',
  },
  {
    id: '10',
    question: 'Who painted the Mona Lisa?',
    answers: {
      A: 'Michelangelo',
      B: 'Raphael',
      C: 'Leonardo da Vinci',
      D: 'Caravaggio',
    },
    correct: 'C',
  },
  {
    id: '11',
    question: 'What is the largest organ in the human body?',
    answers: {
      A: 'Liver',
      B: 'Skin',
      C: 'Brain',
      D: 'Heart',
    },
    correct: 'B',
  },
  {
    id: '12',
    question: 'Which country invented the printing press?',
    answers: {
      A: 'China',
      B: 'England',
      C: 'Germany',
      D: 'Italy',
    },
    correct: 'C',
  },
  {
    id: '13',
    question: 'What is the square root of 144?',
    answers: {
      A: '10',
      B: '11',
      C: '13',
      D: '12',
    },
    correct: 'D',
  },
  {
    id: '14',
    question: 'Which Shakespeare play features the character Hamlet?',
    answers: {
      A: 'Macbeth',
      B: 'Hamlet',
      C: 'Othello',
      D: 'King Lear',
    },
    correct: 'B',
  },
  {
    id: '15',
    question: 'What is the name of the longest river in the world?',
    answers: {
      A: 'Amazon',
      B: 'Mississippi',
      C: 'Yangtze',
      D: 'Nile',
    },
    correct: 'D',
  },
];

export default defaultQuestions;

// quiz-manager.js
// This module manages the state and logic of a quiz session.

import { QUIZ_DATA } from "./quiz.js";
import { choice } from "./utils.js";

export class QuizManager {
  /**
   * Creates a new quiz session.
   * @param {string} quizType - The key for the quiz in QUIZ_DATA (e.g., 'driving_test').
   * @param {number} questionsCount - The total number of questions to ask in this session.
   * @param {number} requiredToPass - The number of correct answers needed to pass.
   * @param {function} onCompleteCallback - A function to call when the quiz is finished. It receives an object like { passed: boolean, score: number, total: number }.
   */
  constructor(quizType, questionsCount, requiredToPass, onCompleteCallback) {
    if (!QUIZ_DATA[quizType]) {
      throw new Error(`Quiz type "${quizType}" not found in QUIZ_DATA.`);
    }
    this.quizData = QUIZ_DATA[quizType];
    this.allQuestions = [...this.quizData.questions]; // Create a copy to avoid modifying the original
    this.questionsToAsk = [];
    this.questionsCount = questionsCount;
    this.requiredToPass = requiredToPass;
    this.onComplete = onCompleteCallback;

    this.currentQuestionIndex = -1;
    this.score = 0;
    this.isStarted = false;
  }

  /**
   * Shuffles and selects the questions for the current quiz session.
   */
  start() {
    // Simple shuffle and pick logic
    const shuffled = this.allQuestions.sort(() => 0.5 - Math.random());
    this.questionsToAsk = shuffled.slice(0, this.questionsCount);
    
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.isStarted = true;
  }

  /**
   * Gets the current question object.
   * @returns {object | null} The current question object or null if the quiz is not started or finished.
   */
  getCurrentQuestion() {
    if (!this.isStarted || this.isQuizOver()) {
      return null;
    }
    return this.questionsToAsk[this.currentQuestionIndex];
  }

  /**
   * Processes the user's answer for the current question.
   * @param {string} selectedOptionKey - The 'option_key' of the selected answer.
   * @returns {boolean} True if the answer was correct, false otherwise.
   */
  submitAnswer(selectedOptionKey) {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return false;

    const selectedOption = currentQuestion.options.find(
      (opt) => opt.option_key === selectedOptionKey
    );

    let wasCorrect = false;
    if (selectedOption && selectedOption.is_correct) {
      this.score++;
      wasCorrect = true;
    }

    // Move to the next question or end the quiz
    this.currentQuestionIndex++;
    if (this.isQuizOver()) {
      this.endQuiz();
    }
    
    return wasCorrect;
  }

  /**
   * Checks if the quiz has ended.
   * @returns {boolean} True if all questions have been answered.
   */
  isQuizOver() {
    return this.currentQuestionIndex >= this.questionsToAsk.length;
  }

  /**
   * Finalizes the quiz and calls the onComplete callback with the results.
   */
  endQuiz() {
    this.isStarted = false;
    const result = {
      passed: this.score >= this.requiredToPass,
      score: this.score,
      total: this.questionsCount,
    };

    if (typeof this.onComplete === "function") {
      this.onComplete(result);
    }
  }
}

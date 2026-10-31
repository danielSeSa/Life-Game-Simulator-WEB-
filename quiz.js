// quiz.js
// This file contains the data structure for all quizzes in the game.

export const QUIZ_DATA = {
  driving_test: {
    title_key: "QUIZ_DRIVING_TEST_TITLE",
    intro_message_key: "QUIZ_DRIVING_TEST_INTRO",
    questions: [
      {
        id: "dt_q1",
        question_key: "Q_DT_1_TEXT", // What does this sign mean?
        image: "https://placehold.co/600x300/e2e8f0/4a5568?text=Stop+Sign",
        options: [
          { option_key: "Q_DT_1_OPT_1", is_correct: true }, // Stop completely
          { option_key: "Q_DT_1_OPT_2", is_correct: false }, // Yield
          { option_key: "Q_DT_1_OPT_3", is_correct: false }, // No Entry
          { option_key: "Q_DT_1_OPT_4", is_correct: false }, // Speed Limit
        ],
      },
      {
        id: "dt_q2",
        question_key: "Q_DT_2_TEXT", // Who has the right-of-way in a roundabout?
        image: "https://placehold.co/600x300/e2e8f0/4a5568?text=Roundabout",
        options: [
          { option_key: "Q_DT_2_OPT_1", is_correct: true }, // Vehicles already in the roundabout
          { option_key: "Q_DT_2_OPT_2", is_correct: false }, // Vehicles entering the roundabout
          { option_key: "Q_DT_2_OPT_3", is_correct: false }, // The larger vehicle
          { option_key: "Q_DT_2_OPT_4", is_correct: false }, // The faster vehicle
        ],
      },
      {
        id: "dt_q3",
        question_key: "Q_DT_3_TEXT", // What does a solid white line on the road indicate?
        image: "https://placehold.co/600x300/e2e8f0/4a5568?text=Solid+White+Line",
        options: [
          { option_key: "Q_DT_3_OPT_1", is_correct: false }, // Lane changing is allowed
          { option_key: "Q_DT_3_OPT_2", is_correct: true }, // Lane changing is discouraged or not allowed
          { option_key: "Q_DT_3_OPT_3", is_correct: false }, // Overtaking is allowed
          { option_key: "Q_DT_3_OPT_4", is_correct: false }, // Marks the road edge only
        ],
      },
      {
        id: "dt_q4",
        question_key: "Q_DT_4_TEXT", // What should you do at a red traffic light?
        image: "https://placehold.co/600x300/e2e8f0/4a5568?text=Red+Light",
        options: [
          { option_key: "Q_DT_4_OPT_1", is_correct: false }, // Proceed with caution
          { option_key: "Q_DT_4_OPT_2", is_correct: false }, // Speed up to clear the intersection
          { option_key: "Q_DT_4_OPT_3", is_correct: true }, // Stop before the intersection line
          { option_key: "Q_DT_4_OPT_4", is_correct: false }, // You can turn right
        ],
      },
      {
        id: "dt_q5",
        question_key: "Q_DT_5_TEXT", // This sign indicates:
        image: "https://placehold.co/600x300/e2e8f0/4a5568?text=Pedestrian+Crossing",
        options: [
          { option_key: "Q_DT_5_OPT_1", is_correct: false }, // A playground nearby
          { option_key: "Q_DT_5_OPT_2", is_correct: false }, // A school zone
          { option_key: "Q_DT_5_OPT_3", is_correct: false }, // No pedestrians allowed
          { option_key: "Q_DT_5_OPT_4", is_correct: true }, // A pedestrian crossing ahead
        ],
      },
      {
        id: "dt_q6",
        question_key: "Q_DT_6_TEXT", // A yellow traffic light means:
        image: "https://placehold.co/600x300/e2e8f0/4a5568?text=Yellow+Light",
        options: [
          { option_key: "Q_DT_6_OPT_1", is_correct: true }, // Prepare to stop as the light is about to turn red
          { option_key: "Q_DT_6_OPT_2", is_correct: false }, // Go faster to beat the red light
          { option_key: "Q_DT_6_OPT_3", is_correct: false }, // Stop immediately, even in the intersection
          { option_key: "Q_DT_6_OPT_4", is_correct: false }, // The light is broken
        ],
      },
      {
        id: "dt_q7",
        question_key: "Q_DT_7_TEXT", // When parking uphill with a curb, you should turn your wheels:
        image: "https://placehold.co/600x300/e2e8f0/4a5568?text=Uphill+Parking",
        options: [
          { option_key: "Q_DT_7_OPT_1", is_correct: false }, // Towards the curb
          { option_key: "Q_DT_7_OPT_2", is_correct: true }, // Away from the curb
          { option_key: "Q_DT_7_OPT_3", is_correct: false }, // Straight ahead
          { option_key: "Q_DT_7_OPT_4", is_correct: false }, // It doesn't matter
        ],
      },
    ],
  },
  university_entrance: {
    title_key: "QUIZ_UNIVERSITY_TEST_TITLE",
    intro_message_key: "QUIZ_UNIVERSITY_TEST_INTRO",
    questions: [
        {
            id: "uni_q1",
            question_key: "Q_UNI_1_TEXT", // What is the capital of France?
            image: "https://placehold.co/600x300/e2e8f0/4a5568?text=Geography",
            options: [
              { option_key: "Q_UNI_1_OPT_1", is_correct: false }, // Berlin
              { option_key: "Q_UNI_1_OPT_2", is_correct: false }, // Madrid
              { option_key: "Q_UNI_1_OPT_3", is_correct: true },  // Paris
              { option_key: "Q_UNI_1_OPT_4", is_correct: false }, // Rome
            ],
        },
        {
            id: "uni_q2",
            question_key: "Q_UNI_2_TEXT", // Solve for x: 2x + 5 = 15
            image: "https://placehold.co/600x300/e2e8f0/4a5568?text=Math",
            options: [
              { option_key: "Q_UNI_2_OPT_1", is_correct: false }, // x = 10
              { option_key: "Q_UNI_2_OPT_2", is_correct: true },  // x = 5
              { option_key: "Q_UNI_2_OPT_3", is_correct: false }, // x = 7.5
              { option_key: "Q_UNI_2_OPT_4", is_correct: false }, // x = 2.5
            ],
        },
        {
            id: "uni_q3",
            question_key: "Q_UNI_3_TEXT", // Which planet is known as the Red Planet?
            image: "https://placehold.co/600x300/e2e8f0/4a5568?text=Science",
            options: [
              { option_key: "Q_UNI_3_OPT_1", is_correct: false }, // Jupiter
              { option_key: "Q_UNI_3_OPT_2", is_correct: false }, // Saturn
              { option_key: "Q_UNI_3_OPT_3", is_correct: false }, // Venus
              { option_key: "Q_UNI_3_OPT_4", is_correct: true },  // Mars
            ],
        },
        {
            id: "uni_q4",
            question_key: "Q_UNI_4_TEXT", // Who wrote "Romeo and Juliet"?
            image: "https://placehold.co/600x300/e2e8f0/4a5568?text=Literature",
            options: [
              { option_key: "Q_UNI_4_OPT_1", is_correct: true },  // William Shakespeare
              { option_key: "Q_UNI_4_OPT_2", is_correct: false }, // Charles Dickens
              { option_key: "Q_UNI_4_OPT_3", is_correct: false }, // Mark Twain
              { option_key: "Q_UNI_4_OPT_4", is_correct: false }, // Jane Austen
            ],
        },
        {
            id: "uni_q5",
            question_key: "Q_UNI_5_TEXT", // What is H2O commonly known as?
            image: "https://placehold.co/600x300/e2e8f0/4a5568?text=Chemistry",
            options: [
              { option_key: "Q_UNI_5_OPT_1", is_correct: false }, // Salt
              { option_key: "Q_UNI_5_OPT_2", is_correct: false }, // Sugar
              { option_key: "Q_UNI_5_OPT_3", is_correct: true },  // Water
              { option_key: "Q_UNI_5_OPT_4", is_correct: false }, // Oxygen
            ],
        },
        {
            id: "uni_q6",
            question_key: "Q_UNI_6_TEXT", // How many continents are there on Earth?
            image: "https://placehold.co/600x300/e2e8f0/4a5568?text=World+Map",
            options: [
              { option_key: "Q_UNI_6_OPT_1", is_correct: false }, // 5
              { option_key: "Q_UNI_6_OPT_2", is_correct: false }, // 6
              { option_key: "Q_UNI_6_OPT_3", is_correct: true },  // 7
              { option_key: "Q_UNI_6_OPT_4", is_correct: false }, // 8
            ],
        }
    ]
  }
};

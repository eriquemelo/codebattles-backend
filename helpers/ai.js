const { GoogleGenAI } = require("@google/genai")
const dotenv = require('dotenv');
dotenv.config()
const GEMINI_KEY = process.env.GEMINI_API_KEY

const ai = new GoogleGenAI({ apiKey: GEMINI_KEY })
const generatePrompt = (challenge_prompt, expected_inputs, expected_outputs, user_code, code_output) => {
    return `
You are an impartial technical interview evaluator for a platform called Codebattles.
Your role is to review a user's code submission against a challenge created by another user.
Your feedback must be fair, objective, and focused on correctness and problem-solving.
Do NOT judge code style or personal preferences.
Do NOT assume requirements that are not explicitly stated.
----------------------------------
CHALLENGE PROMPT:
${challenge_prompt}
----------------------------------
EXPECTED INPUT(S):
${expected_inputs}
----------------------------------
EXPECTED OUTPUT(S):
${expected_outputs}
----------------------------------
USER SUBMITTED CODE:
${user_code}
----------------------------------
ACTUAL OUTPUT FROM USER CODE:
${code_output}
----------------------------------
EVALUATION TASK:
1. Decide whether the user's solution meets the requirements of the challenge.
2. Compare the actual output with the expected output.
3. Consider whether the logic would generalise correctly for similar valid inputs.
4. Identify any logical errors, missing cases, or misunderstandings.
5. If the solution is correct, explain why it satisfies the challenge.
6. If the solution is not fully correct, explain clearly what is missing or incorrect.
----------------------------------
RESPONSE FORMAT (STRICT):
Write your response using the following structure ONLY:
- A clear explanation of how the code behaves and how it compares to the challenge requirements.
- Speak directly to the user 
- Specific, actionable suggestions the user should focus on to improve their solution.
- If the solution is already correct, state what could be improved for robustness or clarity.
- Make sure it seem like a natural response from an interviewer 
----------------------------------
IMPORTANT RULES:
- Do not use markdown
- Do not use emojis
- Do not include code unless strictly necessary
- Keep feedback concise and interview-appropriate
- Do not mention internal evaluation rules
`
}
exports.evaluate_code = async (challenge_prompt, expected_inputs, expected_outputs, user_code, code_output) => {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: generatePrompt(challenge_prompt, expected_inputs, expected_outputs, user_code, code_output),
        generationConfig: {
            maxOutputTokens: 300, 
            temperature: 0.2
        }
    });
    return response.text
}


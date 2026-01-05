import Foundation

struct PracticeSession: Identifiable {
    let id = UUID()
    let table: String
    let operation: String
    let questions: [Question]
    let startTime: Date
    var endTime: Date?
    var currentQuestionIndex: Int = 0
    
    init(table: String, operation: String) {
        self.table = table
        self.operation = operation
        self.questions = Self.generateQuestions(table: table, operation: operation)
        self.startTime = Date()
    }
    
    var currentQuestion: Question? {
        guard currentQuestionIndex < questions.count else { return nil }
        return questions[currentQuestionIndex]
    }
    
    var isCompleted: Bool {
        currentQuestionIndex >= questions.count
    }
    
    var duration: TimeInterval? {
        guard let end = endTime else { return nil }
        return end.timeIntervalSince(startTime)
    }
    
    var progress: String {
        "\(currentQuestionIndex + 1) van \(questions.count)"
    }
    
    mutating func moveToNextQuestion() {
        currentQuestionIndex += 1
        if isCompleted {
            endTime = Date()
        }
    }
    
    private static func generateQuestions(table: String, operation: String) -> [Question] {
        let multipliers = Array(1...10).shuffled()
        return multipliers.map { multiplier in
            Question(table: table, multiplier: multiplier, operation: operation)
        }
    }
}

struct Question: Identifiable {
    let id = UUID()
    let table: Double
    let multiplier: Int
    let operation: String
    let questionText: String
    let answer: Double
    
    init(table: String, multiplier: Int, operation: String) {
        self.table = table.replacingOccurrences(of: ",", with: ".").toDouble() ?? 0.0
        self.multiplier = multiplier
        self.operation = operation
        
        if operation == "divide" {
            let result = self.table * Double(multiplier)
            self.questionText = "\(Int(result)) : \(Int(self.table)) = "
            self.answer = Double(multiplier)
        } else {
            self.questionText = "\(multiplier) × \(Int(self.table)) = "
            self.answer = self.table * Double(multiplier)
        }
    }
    
    func checkAnswer(_ userAnswer: String) -> Bool {
        let userAnswerDouble = userAnswer.replacingOccurrences(of: ",", with: ".").toDouble() ?? 0.0
        return abs(userAnswerDouble - answer) < 0.0001
    }
}

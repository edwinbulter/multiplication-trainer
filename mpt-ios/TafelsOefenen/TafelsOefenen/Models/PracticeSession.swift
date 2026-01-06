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
        let formatter = NumberFormatter()
        formatter.locale = Locale(identifier: "nl_NL")
        self.table = formatter.number(from: table)?.doubleValue ?? 0.0
        self.multiplier = multiplier
        self.operation = operation
        
        print("DEBUG: Creating question - table: \(self.table), multiplier: \(multiplier), operation: '\(operation)'")
        
        if operation == "divide" {
            let result = self.table * Double(multiplier)
            let formattedTable = table // Use original string to preserve precision
            let formattedResult = result.truncatingRemainder(dividingBy: 1) == 0 ? String(Int(result)) : String(format: "%g", result).replacingOccurrences(of: ".", with: ",")
            self.questionText = "\(formattedResult) : \(formattedTable) = "
            self.answer = Double(multiplier)
            print("DEBUG: Division case - answer set to: \(self.answer)")
        } else {
            let formattedTable = table // Use original string to preserve precision
            self.questionText = "\(multiplier) × \(formattedTable) = "
            self.answer = (self.table * Double(multiplier)).rounded(toPlaces: 10)
            print("DEBUG: Multiplication case - answer set to: \(self.answer)")
        }
    }
    
    func checkAnswer(_ userAnswer: String) -> Bool {
        // Use the same Dutch locale parser as toDouble()
        let formatter = NumberFormatter()
        formatter.locale = Locale(identifier: "nl_NL")
        guard let userAnswerDouble = formatter.number(from: userAnswer)?.doubleValue else { 
            print("DEBUG: Failed to parse '\(userAnswer)'")
            return false 
        }
        
        print("DEBUG: User answer: \(userAnswerDouble), Expected: \(answer), Diff: \(abs(userAnswerDouble - answer))")
        
        // Direct comparison should work for both 1 and 1,0
        return abs(userAnswerDouble - answer) < 0.001
    }
}

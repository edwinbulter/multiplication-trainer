import Foundation
import SwiftUI
import Combine

@MainActor
class PracticeViewModel: ObservableObject {
    @Published var session: PracticeSession
    @Published var userAnswer = ""
    @Published var isCorrect: Bool?
    @Published var isFinished = false
    
    init(table: String, operation: String) {
        self.session = PracticeSession(table: table, operation: operation)
    }
    
    var currentQuestion: Question? {
        session.currentQuestion
    }
    
    var progress: String {
        session.progress
    }
    
    var headerText: String {
        if session.operation == "divide" {
            return "Delen door \(session.table)"
        } else {
            return "Tafel van \(session.table)"
        }
    }
    
    func checkAnswer() -> Bool {
        guard let question = currentQuestion else { return false }
        
        let correct = question.checkAnswer(userAnswer)
        isCorrect = correct
        
        // Don't auto-advance on correct answers - let the UI handle it
        if correct {
            // Keep the answer and isCorrect state for UI display
            // UI will call moveToNextQuestion() after showing success message
        } else {
            // Clear answer automatically when wrong
            userAnswer = ""
        }
        
        return correct
    }
    
    func moveToNextQuestion() {
        session.moveToNextQuestion()
        userAnswer = ""
        isCorrect = nil
        
        if session.isCompleted {
            finishPractice()
        }
    }
    
    private func finishPractice() {
        isFinished = true
    }
    
    func clearAnswer() {
        userAnswer = ""
        isCorrect = nil
    }
    
    func appendToAnswer(_ value: String) {
        userAnswer += value
    }
    
    func removeFromAnswer() {
        if !userAnswer.isEmpty {
            userAnswer.removeLast()
        }
    }
}

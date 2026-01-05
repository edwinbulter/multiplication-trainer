import Foundation
import SwiftUI

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
        
        if correct {
            session.moveToNextQuestion()
            userAnswer = ""
            isCorrect = nil
            
            if session.isCompleted {
                finishPractice()
            }
        }
        
        return correct
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

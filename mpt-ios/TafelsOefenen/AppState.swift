import Foundation
import SwiftUI

@MainActor
class AppState: ObservableObject {
    @Published var currentUser: User?
    @Published var selectedTable: String = ""
    @Published var selectedOperation: String = "multiply"
    
    private let storageManager = StorageManager()
    
    init() {
        loadUserData()
    }
    
    // MARK: - User Management
    func saveUser(_ user: User) {
        currentUser = user
        storageManager.saveUser(user)
    }
    
    func loadUserData() {
        currentUser = storageManager.loadUser()
    }
    
    func logout() {
        currentUser = nil
        storageManager.removeUser()
    }
    
    // MARK: - Score Management
    func saveScore(_ score: Score) {
        storageManager.saveScore(score)
    }
    
    func getScoresForCurrentUser() -> [Score] {
        guard let user = currentUser else { return [] }
        return storageManager.loadScores().filter { $0.username == user.username }
    }
    
    func clearScores() {
        storageManager.clearScores()
    }
}

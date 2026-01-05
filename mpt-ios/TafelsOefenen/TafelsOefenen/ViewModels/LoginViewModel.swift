import Foundation
import SwiftUI
import Combine

@MainActor
class LoginViewModel: ObservableObject {
    @Published var username = ""
    @Published var isShowingTableSelection = false
    
    private let storageManager = StorageManager()
    
    var canLogin: Bool {
        !username.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }
    
    func login() {
        guard canLogin else { return }
        
        let user = User(username: username.trimmingCharacters(in: .whitespacesAndNewlines))
        storageManager.saveUser(user)
        
        isShowingTableSelection = true
    }
}

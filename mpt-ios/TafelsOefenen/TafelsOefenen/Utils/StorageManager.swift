import Foundation

class StorageManager {
    private let userDefaults = UserDefaults.standard
    
    // MARK: - User Management
    func saveUser(_ user: User) {
        if let encoded = try? JSONEncoder().encode(user) {
            userDefaults.set(encoded, forKey: AppConstants.StorageKeys.user)
        }
    }
    
    func loadUser() -> User? {
        guard let data = userDefaults.data(forKey: AppConstants.StorageKeys.user),
              let user = try? JSONDecoder().decode(User.self, from: data) else {
            return nil
        }
        return user
    }
    
    func removeUser() {
        userDefaults.removeObject(forKey: AppConstants.StorageKeys.user)
    }
    
    // MARK: - Score Management
    func saveScore(_ score: Score) {
        var scores = loadScores()
        scores.append(score)
        scores.sort { $0.timestamp > $1.timestamp }
        
        if let encoded = try? JSONEncoder().encode(scores) {
            userDefaults.set(encoded, forKey: AppConstants.StorageKeys.scores)
        }
    }
    
    func loadScores() -> [Score] {
        guard let data = userDefaults.data(forKey: AppConstants.StorageKeys.scores),
              let scores = try? JSONDecoder().decode([Score].self, from: data) else {
            return []
        }
        return scores.sorted { $0.timestamp > $1.timestamp }
    }
    
    func clearScores() {
        userDefaults.removeObject(forKey: AppConstants.StorageKeys.scores)
    }
    
    // MARK: - Settings Management
    func saveSetting<T>(_ value: T, forKey key: String) {
        userDefaults.set(value, forKey: "\(AppConstants.StorageKeys.settings).\(key)")
    }
    
    func getSetting<T>(forKey key: String, defaultValue: T) -> T {
        return userDefaults.object(forKey: "\(AppConstants.StorageKeys.settings).\(key)") as? T ?? defaultValue
    }
}

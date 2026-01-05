import Foundation
import SwiftUI
import Combine

@MainActor
class ScoreboardViewModel: ObservableObject {
    @Published var scores: [Score] = []
    @Published var sortOrder: SortOrder = .table
    
    private let storageManager = StorageManager()
    
    var sortedScores: [Score] {
        switch sortOrder {
        case .table:
            return scores.sorted { score1, score2 in
                let table1 = Double(score1.table.replacingOccurrences(of: ":", with: "").replacingOccurrences(of: ",", with: ".")) ?? 0.0
                let table2 = Double(score2.table.replacingOccurrences(of: ":", with: "").replacingOccurrences(of: ",", with: ".")) ?? 0.0
                return table1 < table2
            }
        case .duration:
            return scores.sorted { $0.duration < $1.duration }
        case .date:
            return scores.sorted { $0.timestamp > $1.timestamp }
        }
    }
    
    func loadScores(for username: String) {
        scores = storageManager.loadScores().filter { $0.username == username }
    }
    
    func clearScores() {
        storageManager.clearScores()
        scores.removeAll()
    }
    
    func setSortOrder(_ order: SortOrder) {
        sortOrder = order
    }
}

enum SortOrder {
    case table
    case duration
    case date
}

import Foundation
import SwiftUI
import Combine

@MainActor
class ScoreboardViewModel: ObservableObject {
    @Published var scores: [Score] = []
    @Published private(set) var sortColumn: SortColumn = .table
    @Published private(set) var isAscending: Bool = true
    
    private let storageManager = StorageManager()
    
    var sortedScores: [Score] {
        switch sortColumn {
        case .table:
            return scores.sorted { first, second in
                let table1 = Double(first.table.replacingOccurrences(of: ":", with: "").replacingOccurrences(of: ",", with: ".")) ?? 0.0
                let table2 = Double(second.table.replacingOccurrences(of: ":", with: "").replacingOccurrences(of: ",", with: ".")) ?? 0.0
                return isAscending ? table1 < table2 : table1 > table2
            }
        case .duration:
            return scores.sorted { first, second in
                return isAscending ? first.duration < second.duration : first.duration > second.duration
            }
        case .date:
            return scores.sorted { first, second in
                return isAscending ? first.timestamp < second.timestamp : first.timestamp > second.timestamp
            }
        }
    }
    
    func loadScores(for username: String) {
        scores = storageManager.loadScores().filter { $0.username == username }
    }
    
    func clearScores() {
        storageManager.clearScores()
        scores.removeAll()
    }
    
    func toggleSort(_ column: SortColumn) {
        if sortColumn == column {
            isAscending.toggle()
        } else {
            sortColumn = column
            switch column {
            case .table, .duration:
                isAscending = true
            case .date:
                isAscending = false
            }
        }
    }
}

enum SortColumn: Equatable {
    case table
    case duration
    case date
}

import Foundation

struct Score: Codable, Identifiable {
    let id = UUID()
    let username: String
    let table: String
    let operation: String // "multiply" or "divide"
    let duration: TimeInterval // in seconds
    let timestamp: Date
    
    init(username: String, table: String, operation: String, duration: TimeInterval) {
        self.username = username
        self.table = table
        self.operation = operation
        self.duration = duration
        self.timestamp = Date()
    }
    
    // For display purposes
    var displayTable: String {
        if operation == "divide" {
            return ": \(table)"
        } else {
            return "× \(table)"
        }
    }
    
    var formattedDuration: String {
        let seconds = Int(duration)
        return "\(seconds) seconden"
    }
    
    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        formatter.locale = Locale(identifier: "nl_NL")
        return formatter.string(from: timestamp)
    }
}

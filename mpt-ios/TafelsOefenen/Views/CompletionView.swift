import SwiftUI

struct CompletionView: View {
    let table: String
    let operation: String
    let duration: TimeInterval
    
    @Environment(\.dismiss) private var dismiss
    
    private let storageManager = StorageManager()
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 30) {
                // Header
                Text("Tafels Oefenen")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.blue)
                
                // Success Message
                VStack(spacing: 20) {
                    Text("Goed gedaan!")
                        .font(.title)
                        .fontWeight(.semibold)
                        .foregroundColor(.green)
                    
                    Text("Je hebt de tafel van \(table) afgerond in \(Int(duration)) seconden!")
                        .font(.body)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                }
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(12)
                
                Spacer()
                
                // Action Button
                Button("Kies een andere tafel") {
                    dismiss()
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.blue)
                .cornerRadius(8)
                
                Spacer()
            }
            .padding()
            .onAppear {
                // Save the score
                // TODO: Get current username and save score
                let score = Score(
                    username: "User", // TODO: Get from AppState
                    table: table,
                    operation: operation,
                    duration: duration
                )
                storageManager.saveScore(score)
            }
        }
    }
}

#Preview {
    CompletionView(table: "5", operation: "multiply", duration: 45.0)
}

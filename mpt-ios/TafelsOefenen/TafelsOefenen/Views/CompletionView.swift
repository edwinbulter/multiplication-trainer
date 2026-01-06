import SwiftUI

struct CompletionView: View {
    let table: String
    let operation: String
    let duration: TimeInterval
    
    @Environment(\.dismiss) private var dismiss
    
    private let storageManager = StorageManager()
    
    var body: some View {
        NavigationStack {
            ZStack {
                // Background
                AppColors.background
                    .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Header
                    Text("Tafels Oefenen")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(AppColors.primary)
                        .padding(.top, 32)
                    
                    // Card
                    VStack(spacing: 32) {
                        // Congratulations Text
                        Text("Goed gedaan! 🎉")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .foregroundColor(AppColors.success)
                        
                        // Completion Message
                        Text("Je hebt de tafel van \(table) afgerond in \(Int(duration)) seconden!")
                            .font(.body)
                            .foregroundColor(AppColors.black)
                            .multilineTextAlignment(.center)
                        
                        // Choose Table Button
                        Button(action: {
                            dismiss()
                        }) {
                            Text("Kies een andere tafel")
                                .foregroundColor(AppColors.white)
                                .font(.headline)
                                .padding(.horizontal, 24)
                                .padding(.vertical, 16)
                                .background(AppColors.primary)
                                .cornerRadius(8)
                        }
                        .buttonStyle(.plain)
                    }
                    .padding(32)
                    .background(AppColors.white)
                    .cornerRadius(16)
                    .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
                    .padding(.horizontal, 32)
                    .padding(.top, 64)
                    
                    Spacer()
                }
            }
            .navigationBarHidden(true)
        }
        .onAppear {
            saveScore()
        }
    }
    
    private func saveScore() {
        let username = storageManager.loadUser()?.username ?? "Anoniem"
        let score = Score(
            username: username,
            table: table,
            operation: operation,
            duration: duration
        )
        storageManager.saveScore(score)
    }
}

#Preview {
    CompletionView(table: "5", operation: "multiply", duration: 45.0)
}

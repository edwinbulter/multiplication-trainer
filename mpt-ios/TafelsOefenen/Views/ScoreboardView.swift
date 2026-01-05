import SwiftUI

struct ScoreboardView: View {
    @StateObject private var viewModel = ScoreboardViewModel()
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                // Header
                Text("Scorebord")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.blue)
                
                // Sort Options
                HStack {
                    Button("Tafel") {
                        viewModel.setSortOrder(.table)
                    }
                    .foregroundColor(viewModel.sortOrder == .table ? .white : .blue)
                    .padding(.horizontal)
                    .background(viewModel.sortOrder == .table ? Color.blue : Color.clear)
                    .cornerRadius(8)
                    
                    Button("Tijd") {
                        viewModel.setSortOrder(.duration)
                    }
                    .foregroundColor(viewModel.sortOrder == .duration ? .white : .blue)
                    .padding(.horizontal)
                    .background(viewModel.sortOrder == .duration ? Color.blue : Color.clear)
                    .cornerRadius(8)
                    
                    Button("Datum") {
                        viewModel.setSortOrder(.date)
                    }
                    .foregroundColor(viewModel.sortOrder == .date ? .white : .blue)
                    .padding(.horizontal)
                    .background(viewModel.sortOrder == .date ? Color.blue : Color.clear)
                    .cornerRadius(8)
                }
                
                // Scores List
                if viewModel.scores.isEmpty {
                    VStack(spacing: 20) {
                        Text("Geen scores yet")
                            .font(.title2)
                            .foregroundColor(.gray)
                        
                        Text("Oefen tafels om scores te zien")
                            .font(.body)
                            .foregroundColor(.gray)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    List(viewModel.sortedScores) { score in
                        HStack {
                            VStack(alignment: .leading) {
                                Text(score.displayTable)
                                    .font(.headline)
                                Text(score.formattedDate)
                                    .font(.caption)
                                    .foregroundColor(.gray)
                            }
                            
                            Spacer()
                            
                            Text(score.formattedDuration)
                                .font(.body)
                                .foregroundColor(.blue)
                        }
                        .padding(.vertical, 4)
                    }
                }
                
                // Clear Scores Button
                Button("Wis Scores") {
                    viewModel.clearScores()
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.red)
                .cornerRadius(8)
                
                // Back Button
                Button("Terug") {
                    dismiss()
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.gray)
                .cornerRadius(8)
            }
            .padding()
            .onAppear {
                // TODO: Get current username from AppState
                viewModel.loadScores(for: "User")
            }
        }
    }
}

#Preview {
    ScoreboardView()
}

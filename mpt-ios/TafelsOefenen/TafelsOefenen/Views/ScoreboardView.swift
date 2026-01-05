import SwiftUI

struct ScoreboardView: View {
    @StateObject private var viewModel = ScoreboardViewModel()
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var appState: AppState
    
    private static let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "dd/MM/yy HH:mm"
        return formatter
    }()
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Text("Scorebord")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(AppColors.primary)
                
                Button("Wis Scorebord") {
                    viewModel.clearScores()
                }
                .foregroundColor(.white)
                .fontWeight(.bold)
                .frame(maxWidth: .infinity)
                .padding()
                .background(AppColors.error)
                .cornerRadius(8)
                
                scoreboardContent
                
                Button("Terug naar Tafels") {
                    dismiss()
                }
                .foregroundColor(.white)
                .fontWeight(.bold)
                .frame(maxWidth: .infinity)
                .padding()
                .background(AppColors.primary)
                .cornerRadius(8)
            }
            .padding()
            .onAppear {
                let username = appState.currentUser?.username ?? "Anoniem"
                viewModel.loadScores(for: username)
            }
        }
    }
    
    @ViewBuilder
    private var scoreboardContent: some View {
        if viewModel.scores.isEmpty {
            VStack(spacing: 20) {
                Text("Nog geen scores")
                    .font(.title2)
                    .foregroundColor(.gray)
                
                Text("Oefen tafels om scores te zien")
                    .font(.body)
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        } else {
            VStack(spacing: 0) {
                headerRow
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(Color.gray.opacity(0.15))
                
                Divider()
                
                ScrollView {
                    LazyVStack(spacing: 0) {
                        ForEach(viewModel.sortedScores) { score in
                            HStack {
                                Text(score.displayTable)
                                    .font(.headline)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                
                                Text(secondsText(for: score))
                                    .font(.headline)
                                    .frame(width: 60, alignment: .center)
                                
                                Text(formattedDate(score.timestamp))
                                    .font(.subheadline)
                                    .frame(maxWidth: .infinity, alignment: .trailing)
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 12)
                            
                            Divider()
                        }
                    }
                }
            }
            .frame(maxWidth: .infinity)
            .background(Color.white)
            .cornerRadius(12)
            .shadow(color: Color.black.opacity(0.08), radius: 8, x: 0, y: 4)
        }
    }
    
    private var headerRow: some View {
        HStack {
            headerButton(title: "Tafel", column: .table)
                .frame(maxWidth: .infinity, alignment: .leading)
            
            headerButton(title: "Sec", column: .duration)
                .frame(width: 60, alignment: .center)
            
            headerButton(title: "Datum/tijd", column: .date)
                .frame(maxWidth: .infinity, alignment: .trailing)
        }
        .font(.headline)
        .foregroundColor(.blue)
    }
    
    private func headerButton(title: String, column: SortColumn) -> some View {
        Button {
            viewModel.toggleSort(column)
        } label: {
            HStack(spacing: 4) {
                Text(title)
                Text(sortIndicator(for: column))
                    .font(.subheadline)
            }
        }
        .buttonStyle(.plain)
    }
    
    private func sortIndicator(for column: SortColumn) -> String {
        guard viewModel.sortColumn == column else {
            return "↕"
        }
        return viewModel.isAscending ? "↑" : "↓"
    }
    
    private func secondsText(for score: Score) -> String {
        let seconds = Int(score.duration.rounded())
        return "\(seconds)"
    }
    
    private func formattedDate(_ date: Date) -> String {
        Self.dateFormatter.string(from: date)
    }
}

#Preview {
    ScoreboardView()
}

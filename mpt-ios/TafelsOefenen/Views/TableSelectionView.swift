import SwiftUI

struct TableSelectionView: View {
    @StateObject private var viewModel = LoginViewModel()
    @State private var selectedTable = ""
    @State private var customTable = ""
    @State private var isMultiply = true
    @State private var showingScoreboard = false
    @State private var showingPractice = false
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                // Header
                Text("Tafels Oefenen")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.blue)
                
                Text("Welkom!")
                    .font(.title2)
                    .foregroundColor(.green)
                
                Text("Welk tafeltje wil je oefenen?")
                    .font(.body)
                    .foregroundColor(.gray)
                
                // Scoreboard Button
                Button("Bekijk Scorebord") {
                    showingScoreboard = true
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.teal)
                .cornerRadius(8)
                
                // Operation Toggle
                HStack {
                    Text("Operatie:")
                        .font(.body)
                    Spacer()
                    Text(isMultiply ? "Vermenigvuldigen" : "Delen")
                        .font(.body)
                    Toggle("", isOn: Binding(
                        get: { isMultiply },
                        set: { isMultiply = $0 }
                    ))
                }
                .padding()
                
                // Table Grid
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 10) {
                    ForEach(AppConstants.predefinedTables, id: \.self) { table in
                        Button(table) {
                            selectedTable = table
                            showingPractice = true
                        }
                        .foregroundColor(.white)
                        .frame(height: 50)
                        .background(Color.blue)
                        .cornerRadius(8)
                    }
                }
                
                // Custom Table Input
                VStack(alignment: .leading, spacing: 10) {
                    Text("Of kies je eigen getal:")
                        .font(.body)
                        .foregroundColor(.gray)
                    
                    HStack {
                        TextField("Bijv. 7 of 1,5", text: $customTable)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                        
                        Button("Start") {
                            if !customTable.isEmpty {
                                selectedTable = customTable
                                showingPractice = true
                            }
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal)
                        .background(Color.green)
                        .cornerRadius(8)
                    }
                }
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(8)
                
                Spacer()
                
                // Logout Button
                Button("Uitloggen") {
                    // TODO: Implement logout
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.red)
                .cornerRadius(8)
            }
            .padding()
            .navigationDestination(isPresented: $showingPractice) {
                PracticeView(table: selectedTable, operation: isMultiply ? "multiply" : "divide")
            }
            .navigationDestination(isPresented: $showingScoreboard) {
                ScoreboardView()
            }
        }
    }
}

#Preview {
    TableSelectionView()
}

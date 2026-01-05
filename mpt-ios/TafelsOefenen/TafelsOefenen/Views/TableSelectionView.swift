import SwiftUI

struct TableSelectionView: View {
    @EnvironmentObject var appState: AppState
    @State private var selectedTable = ""
    @State private var customTable = ""
    @State private var isMultiply = true
    @State private var showingScoreboard = false
    @State private var showingPractice = false
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 12) {
                    // Header
                    VStack(spacing: 4) {
                        Text("Tafels Oefenen")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.blue)
                        
                        Text("Welkom, \(appState.currentUser?.username ?? "Gebruiker")!")
                            .font(.headline)
                            .foregroundColor(.green)
                        
                        Text("Welk tafeltje wil je oefenen?")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                    .padding(.top, 8)
                    
                    // Scoreboard Button
                    Button("Bekijk Scorebord") {
                        showingScoreboard = true
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(Color.teal)
                    .cornerRadius(8)
                    .padding(.horizontal)
                    
                    // Operation Toggle
                    VStack(spacing: 6) {
                        Text("Operatie")
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundColor(.primary)
                        
                        HStack(spacing: 12) {
                            Button("Vermenigvuldigen") {
                                isMultiply = true
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 8)
                            .background(isMultiply ? Color.blue : Color.gray.opacity(0.3))
                            .cornerRadius(6)
                            .font(.caption)
                            
                            Button("Delen") {
                                isMultiply = false
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 8)
                            .background(!isMultiply ? Color.blue : Color.gray.opacity(0.3))
                            .cornerRadius(6)
                            .font(.caption)
                        }
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 8)
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(8)
                    .padding(.horizontal)
                    
                    // Table Grid
                    VStack(spacing: 8) {
                        Text("Kies een tafel")
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundColor(.primary)
                        
                        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 6), count: 3), spacing: 6) {
                            ForEach(AppConstants.predefinedTables, id: \.self) { table in
                                Button(table) {
                                    selectedTable = table
                                    showingPractice = true
                                }
                                .foregroundColor(.white)
                                .frame(height: 36)
                                .frame(maxWidth: .infinity)
                                .background(Color.blue)
                                .cornerRadius(6)
                                .font(.system(size: 14, weight: .semibold))
                            }
                        }
                    }
                    .padding(.horizontal)
                    
                    // Custom Table Input
                    VStack(spacing: 6) {
                        Text("Of kies je eigen getal")
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundColor(.primary)
                        
                        HStack(spacing: 8) {
                            TextField("Bijv. 7 of 1,5", text: $customTable)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .keyboardType(.decimalPad)
                            
                            Button("Start") {
                                if !customTable.isEmpty && customTable.isValidNumber() {
                                    selectedTable = customTable
                                    showingPractice = true
                                }
                            }
                            .foregroundColor(.white)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 8)
                            .background(Color.green)
                            .cornerRadius(6)
                            .font(.caption)
                            .disabled(customTable.isEmpty || !customTable.isValidNumber())
                        }
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 8)
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(8)
                    .padding(.horizontal)
                    
                    // Logout Button
                    Button("Uitloggen") {
                        appState.logout()
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(Color.red)
                    .cornerRadius(8)
                    .padding(.horizontal)
                    .padding(.bottom, 16)
                }
            }
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

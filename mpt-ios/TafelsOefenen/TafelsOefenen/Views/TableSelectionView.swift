import SwiftUI

struct TableSelectionView: View {
    @EnvironmentObject var appState: AppState
    @State private var selectedTable = ""
    @State private var customTable = ""
    @State private var isMultiply = true
    @State private var showingScoreboard = false
    @State private var showingPractice = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 12) {
                    // Header
                    VStack(spacing: 4) {
                        Text("Tafels Oefenen")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(AppColors.primary)
                        
                        Text("Welkom, \(appState.currentUser?.username ?? "Gebruiker")!")
                            .font(.headline)
                            .foregroundColor(AppColors.secondary)
                        
                        Text("Welk tafeltje wil je oefenen?")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                    }
                    .padding(.top, 8)
                    
                    // Scoreboard Button
                    Button(action: {
                        showingScoreboard = true
                    }) {
                        Text("Bekijk Scorebord")
                            .foregroundColor(.white)
                            .fontWeight(.bold)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 8)
                            .background(AppColors.secondary)
                            .cornerRadius(8)
                    }
                    .buttonStyle(.plain)
                    .padding(.horizontal)
                    
                    // Operation Toggle
                    VStack(spacing: 6) {
                        Text("Operatie")
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundColor(.primary)
                        
                        HStack(spacing: 12) {
                            Button(action: {
                                isMultiply = true
                            }) {
                                Text("Vermenigvuldigen")
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 8)
                                    .background(isMultiply ? Color.blue : Color.gray.opacity(0.3))
                                    .cornerRadius(6)
                                    .font(.system(size: 11, weight: .bold))
                            }
                            .buttonStyle(.plain)
                            
                            Button(action: {
                                isMultiply = false
                            }) {
                                Text("Delen")
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 8)
                                    .background(!isMultiply ? Color.blue : Color.gray.opacity(0.3))
                                    .cornerRadius(6)
                                    .font(.system(size: 11, weight: .bold))
                            }
                            .buttonStyle(.plain)
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
                                Button(action: {
                                    selectedTable = table
                                    showingPractice = true
                                }) {
                                    Text(table)
                                        .foregroundColor(.white)
                                        .frame(height: 36)
                                        .frame(maxWidth: .infinity)
                                        .background(Color.blue)
                                        .cornerRadius(6)
                                        .font(.system(size: 14, weight: .semibold))
                                }
                                .buttonStyle(.plain)
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
                                .onChange(of: customTable) { newValue in
                                    let allowed = CharacterSet(charactersIn: "0123456789,")
                                    let filtered = String(newValue.unicodeScalars.filter { allowed.contains($0) })
                                    if filtered != newValue {
                                        customTable = filtered
                                    }
                                }
                            
                            Button("Start") {
                                if !customTable.isEmpty && customTable.isValidNumber() {
                                    selectedTable = customTable
                                    showingPractice = true
                                }
                            }
                            .foregroundColor(.white)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 8)
                            .background(AppColors.secondary)
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
                    Button(action: {
                        appState.logout()
                    }) {
                        Text("Uitloggen")
                            .foregroundColor(.white)
                            .fontWeight(.bold)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 8)
                            .background(Color.red)
                            .cornerRadius(8)
                    }
                    .buttonStyle(.plain)
                    .padding(.horizontal)
                    .padding(.bottom, 16)
                }
            }
            .background(
                VStack {
                    NavigationLink(
                        destination: PracticeView(table: selectedTable.isEmpty ? "1" : selectedTable, operation: isMultiply ? "multiply" : "divide"),
                        isActive: $showingPractice,
                        label: { EmptyView() }
                    )
                    .opacity(0)
                    
                    NavigationLink(
                        destination: ScoreboardView(),
                        isActive: $showingScoreboard,
                        label: { EmptyView() }
                    )
                    .opacity(0)
                }
            )
        }
    }
}

#Preview {
    TableSelectionView()
}

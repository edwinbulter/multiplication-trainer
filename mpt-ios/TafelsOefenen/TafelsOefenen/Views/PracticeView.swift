import SwiftUI

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

struct PracticeView: View {
    let table: String
    let operation: String
    
    @StateObject private var viewModel: PracticeViewModel
    @Environment(\.dismiss) private var dismiss
    
    init(table: String, operation: String) {
        self.table = table
        self.operation = operation
        self._viewModel = StateObject(wrappedValue: PracticeViewModel(table: table, operation: operation))
    }
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 12) {
                Text(viewModel.headerText)
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(AppColors.secondary)
                    .padding(.top, 20)
                
                // Question and Answer - No boxes, inline, single equals
                if let question = viewModel.currentQuestion {
                    HStack(spacing: 8) {
                        //Spacer()
                        Text(question.questionText.replacingOccurrences(of: "=", with: ""))
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(AppColors.black)
                        
                        Text("=")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(AppColors.black)
                        
                        Text(viewModel.userAnswer.isEmpty ? "?" : viewModel.userAnswer)
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(viewModel.userAnswer.isEmpty ? AppColors.textHint : AppColors.primary)
                        
                        Spacer()
                    }
                    .padding(.horizontal, 20)
                    
                    // Stop Button - Light gray background, black font
                    Button("Stop Oefenen") {
                        dismiss()
                    }
                    .foregroundColor(AppColors.black)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(AppColors.keyDarkGray)
                    .cornerRadius(8)
                    .padding(.horizontal)
                    
                    // Error message - Softer corners, more padding like reference
                    if viewModel.isCorrect == false {
                        Text("Fout, probeer opnieuw")
                            .font(.headline)
                            .foregroundColor(AppColors.white)
                            .frame(maxWidth: .infinity)
                            .padding(.horizontal, 24)
                            .padding(.vertical, 10)
                            .background(AppColors.error)
                            .cornerRadius(12)
                            .padding(.horizontal)
                    }
                    
                    // Success message (shown briefly when correct)
                    if viewModel.isCorrect == true {
                        Text("Goed!")
                            .font(.headline)
                            .foregroundColor(AppColors.white)
                            .frame(maxWidth: .infinity)
                            .padding(.horizontal, 24)
                            .padding(.vertical, 10)
                            .background(AppColors.success)
                            .cornerRadius(12)
                            .padding(.horizontal)
                            .onAppear {
                                // Auto-advance after delay
                                DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                                    if viewModel.isCorrect == true {
                                        viewModel.moveToNextQuestion()
                                    }
                                }
                            }
                    }
                    
                }
                
                Spacer()
                
                // Virtual Keypad - Centered with minimal spacing
                VStack(spacing: 2) {
                    HStack(spacing: 2) {
                        keypadButton("7")
                        keypadButton("8")
                        keypadButton("9")
                    }
                    HStack(spacing: 2) {
                        keypadButton("4")
                        keypadButton("5")
                        keypadButton("6")
                    }
                    HStack(spacing: 2) {
                        keypadButton("1")
                        keypadButton("2")
                        keypadButton("3")
                    }
                    HStack(spacing: 2) {
                        keypadButton(",")
                        keypadButton("0")
                        keypadButton("⌫")
                    }
                }
                
                // Controleer Button - Using success color
                Button("Controleer") {
                    _ = viewModel.checkAnswer()
                }
                .foregroundColor(AppColors.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(AppColors.success)
                .cornerRadius(8)
                .disabled(viewModel.userAnswer.isEmpty)
                .font(.headline)
                .padding(.horizontal)
                
                // Progress at bottom
                Text(viewModel.progress)
                    .font(.caption)
                    .foregroundColor(AppColors.textSecondary)
                    .padding(.bottom, 20)
            }
            .navigationDestination(isPresented: Binding(
                get: { viewModel.isFinished },
                set: { _ in }
            )) {
                if let duration = viewModel.session.duration {
                    CompletionView(
                        table: table,
                        operation: operation,
                        duration: duration
                    )
                }
            }
        }
    }
    
    @ViewBuilder
    private func keypadButton(_ key: String) -> some View {
        Button(key) {
            if key == "⌫" {
                viewModel.removeFromAnswer()
            } else {
                viewModel.appendToAnswer(key)
            }
        }
        .foregroundColor(key == "⌫" ? AppColors.white : AppColors.black)
        .frame(width: 60, height: 60)
        .background(key == "⌫" ? AppColors.error : AppColors.keyGray)
        .cornerRadius(8)
        .font(.title2)
    }
}

#Preview {
    PracticeView(table: "5", operation: "multiply")
}

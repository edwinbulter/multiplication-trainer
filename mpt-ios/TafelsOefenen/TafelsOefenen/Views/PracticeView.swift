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
    @State private var showingCompletion = false
    
    init(table: String, operation: String) {
        self.table = table
        self.operation = operation
        self._viewModel = StateObject(wrappedValue: PracticeViewModel(table: table, operation: operation))
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 12) {
                Text(viewModel.headerText)
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(AppColors.dynamicSecondary)
                    .padding(.bottom, 40)
                                
                // Question and Answer - No boxes, inline, single equals
                if let question = viewModel.currentQuestion {
                    HStack(spacing: 8) {
                        Text(question.questionText.replacingOccurrences(of: "=", with: ""))
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(AppColors.dynamicTextPrimary)
                        
                        Text("=")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(AppColors.dynamicTextPrimary)
                        
                        Text(viewModel.userAnswer.isEmpty ? "?" : viewModel.userAnswer)
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(viewModel.userAnswer.isEmpty ? AppColors.dynamicTextHint : AppColors.dynamicPrimary)
                        
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.leading, 100)

                    
                    
                    // Stop Button - Light gray background, black font
                    // Button("Stop Oefenen") {
                    //     dismiss()
                    // }
                    // .foregroundColor(AppColors.black)
                    // .frame(maxWidth: .infinity)
                    // .padding(.vertical, 10)
                    // .background(AppColors.keyDarkGray)
                    // .cornerRadius(8)
                    // .padding(.horizontal)
                    
                    // Error message - Softer corners, more padding like reference
                    if viewModel.isCorrect == false {
                        Text("Fout, probeer opnieuw")
                            .font(.headline)
                            .foregroundColor(AppColors.white)
                            .frame(maxWidth: .infinity)
                            .padding(.horizontal, 24)
                            .padding(.vertical, 10)
                            .background(AppColors.dynamicError)
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
                            .background(AppColors.dynamicSuccess)
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
                Button(action: {
                    _ = viewModel.checkAnswer()
                }) {
                    Text("Controleer")
                        .foregroundColor(AppColors.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(AppColors.dynamicSuccess)
                        .cornerRadius(8)
                        .font(.system(size: 17, weight: .bold))
                }
                .buttonStyle(.plain)
                .disabled(viewModel.userAnswer.isEmpty)
                .padding(.horizontal)
                .padding(.top, 20)
                
                // Progress at bottom
                Text(viewModel.progress)
                    .font(.subheadline)
                    .foregroundColor(AppColors.dynamicTextSecondary)
                    .padding(.bottom, 20)
            }
            .onChange(of: viewModel.isFinished) { finished in
                if finished {
                    showingCompletion = true
                }
            }
            .sheet(isPresented: $showingCompletion) {
                if let duration = viewModel.session.duration {
                    CompletionView(
                        table: table,
                        operation: operation,
                        duration: duration,
                        onDismiss: {
                            dismiss()
                        }
                    )
                }
            }
        }
    }
    
    @ViewBuilder
    private func keypadButton(_ key: String) -> some View {
        let isDelete = key == "⌫"
        let baseColor = isDelete ? AppColors.error : AppColors.keyGray
        let textColor = isDelete ? AppColors.white : AppColors.black
        
        Button (action: {
            if isDelete {
                viewModel.removeFromAnswer()
            } else {
                viewModel.appendToAnswer(key)
            }
        }){
            Text(key)
                .foregroundColor(textColor)
                .frame(width: 60, height: 60)
                .background(
                    ZStack {
                        // Main button face
                        RoundedRectangle(cornerRadius: 8, style: .continuous)
                            .fill(baseColor)
                        
                        // Bottom/right shadow (dark)
                        RoundedRectangle(cornerRadius: 8, style: .continuous)
                            .stroke(AppColors.black.opacity(0.15), lineWidth: 3)
                            .offset(y: 2)
                        
                        // Top/left highlight (light)
                        RoundedRectangle(cornerRadius: 8, style: .continuous)
                            .stroke(AppColors.white.opacity(0.3), lineWidth: 2)
                            .offset(y: -2)
                    }
                )
                .font(.system(size: 20, weight: .bold))
        }
        .padding(.horizontal, 5)
        .padding(.vertical, 5)
    }
}

#Preview {
    PracticeView(table: "5", operation: "multiply")
}

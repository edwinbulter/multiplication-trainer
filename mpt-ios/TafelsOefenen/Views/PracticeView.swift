import SwiftUI

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
            VStack(spacing: 20) {
                // Header
                Text("Tafels Oefenen")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.blue)
                
                // Progress
                Text(viewModel.progress)
                    .font(.body)
                    .foregroundColor(.gray)
                
                // Question
                if let question = viewModel.currentQuestion {
                    Text(question.questionText)
                        .font(.title)
                        .fontWeight(.semibold)
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(8)
                    
                    // Answer Input
                    Text(viewModel.userAnswer)
                        .font(.title)
                        .fontWeight(.semibold)
                        .foregroundColor(.blue)
                        .frame(minHeight: 50)
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(8)
                }
                
                // Virtual Keypad
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 10) {
                    ForEach(["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ",", "⌫"], id: \.self) { key in
                        Button(key) {
                            if key == "⌫" {
                                viewModel.removeFromAnswer()
                            } else {
                                viewModel.appendToAnswer(key)
                            }
                        }
                        .foregroundColor(.blue)
                        .frame(height: 60)
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(8)
                        .font(.title2)
                    }
                }
                
                // Action Buttons
                HStack(spacing: 20) {
                    Button("Controleer") {
                        _ = viewModel.checkAnswer()
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(viewModel.userAnswer.isEmpty ? Color.gray : Color.blue)
                    .cornerRadius(8)
                    .disabled(viewModel.userAnswer.isEmpty)
                    
                    Button("Stop Oefenen") {
                        dismiss()
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.red)
                    .cornerRadius(8)
                }
                
                Spacer()
            }
            .padding()
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
}

#Preview {
    PracticeView(table: "5", operation: "multiply")
}

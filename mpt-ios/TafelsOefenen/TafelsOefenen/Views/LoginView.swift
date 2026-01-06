import SwiftUI

struct LoginView: View {
    @EnvironmentObject var appState: AppState
    @State private var username = ""
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Tafels Oefenen")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.blue)
            
            Text("Welkom!")
                .font(.title2)
                .foregroundColor(.green)
            
            Text("Voer je naam in om te beginnen")
                .font(.body)
                .foregroundColor(.gray)
            
            TextField("Jouw naam", text: $username)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()
            
            Button(action: {
                if !username.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                    let user = User(username: username.trimmingCharacters(in: .whitespacesAndNewlines))
                    appState.saveUser(user)
                }
            }) {
                Text("Start Oefenen")
                    .foregroundColor(.white)
                    .fontWeight(.bold)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(username.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? Color.gray : Color.blue)
                    .cornerRadius(8)
            }
            .buttonStyle(.plain)
            .disabled(username.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            .padding()
        }
        .padding()
    }
}

#Preview {
    LoginView()
        .environmentObject(AppState())
}

import SwiftUI

struct LoginView: View {
    @EnvironmentObject var appState: AppState
    @State private var username = ""
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Tafels Oefenen")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(AppColors.dynamicPrimary)
            
            Text("Welkom!")
                .font(.title2)
                .foregroundColor(AppColors.dynamicSecondary)
            
            Text("Voer je naam in om te beginnen")
                .font(.body)
                .foregroundColor(AppColors.dynamicTextSecondary)
            
            TextField("Jouw naam", text: $username)
                .padding()
                .background(AppColors.dynamicSurface)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(AppColors.dynamicTextSecondary, lineWidth: 1)
                )
                .foregroundColor(AppColors.dynamicTextPrimary)
            
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
                    .background(username.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? AppColors.dynamicTextSecondary : AppColors.dynamicPrimary)
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

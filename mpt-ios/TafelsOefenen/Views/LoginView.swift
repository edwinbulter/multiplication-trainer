import SwiftUI

struct LoginView: View {
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
            
            TextField("Jouw naam", text: .constant(""))
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()
            
            Button("Start Oefenen") {
                // TODO: Navigate to table selection
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color.blue)
            .cornerRadius(8)
            .padding()
        }
        .padding()
    }
}

#Preview {
    LoginView()
}

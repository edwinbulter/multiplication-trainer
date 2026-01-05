//
//  ContentView.swift
//  TafelsOefenen
//
//  Created by E.G.H. Bulter on 04/01/2026.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        NavigationStack {
            if appState.currentUser == nil {
                LoginView()
            } else {
                TableSelectionView()
            }
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(AppState())
}

//
//  ContentView.swift
//  GOV.UK Frontend Webview Embedding
//
//  Created by Romaric Pascal on 08/04/2024.
//

import SwiftUI
import WebKit

struct ContentView: UIViewRepresentable {
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.load(URLRequest(url: URL(string: "http://localhost:8080")!))
        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {
        // This space can be left blank
    }
}

#Preview {
    ContentView()
}

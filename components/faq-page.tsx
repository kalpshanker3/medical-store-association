"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Plus, Minus } from "lucide-react"
import { useState } from "react"
import Navbar from "./navbar"
import type { AppState } from "../app/page"

export default function FAQPage(appState: AppState) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqs = [
    {
      question: "संस्था में सदस्यता कैसे लें?",
      answer:
        "सदस्यता के लिए आपको रजिस्ट्रेशन फॉर्म भरना होगा। इसमें आपकी व्यक्तिगत जानकारी, मेडिकल स्टोर की जानकारी और बैंक विवरण की आवश्यकता होती है। फॉर्म भरने के बाद OTP सत्यापन होगा और फिर प्रशासन द्वारा आपके दस्तावेजों की जांच की जाएगी।",
    },
    {
      question: "सदस्यता शुल्क कितना है?",
      answer:
        "वार्षिक सदस्यता शुल्क ₹100 है। इसमें पंजीकरण शुल्क, प्रशासनिक खर्च और आपातकालीन फंड का योगदान शामिल है। यह राशि हर साल 31 मार्च तक जमा करनी होती है।",
    },
    {
      question: "किसी सदस्य की दुर्घटना पर कितनी सहायता मिलती है?",
      answer:
        "प्रत्येक सदस्य के परिवार ko आर्थिक सहायता प्रदान की जाती है। यह राशि सभी सदस्यों के सहयोग से एकत्रित की जाती है। प्रत्येक सदस्य को न्यूनतम ₹500 का योगदान देना होता है।",
    },
    {
      question: "दान कैसे करें?",
      answer:
        "दान करने के लिए 'दान करें' पेज पर जाएं। वहां mratak/aakashmik durghtana/sahayta सदस्यों की जानकारी और उनके परिवार के बैंक विवरण मिलेंगे। आप  NEFT या RTGS के माध्यम से सीधे उनके खाते में राशि भेज सकते हैं। भुगतान की रसीद अपलोड करना अनिवार्य है।",
    },
    {
      question: "सदस्यता के क्या फायदे हैं?",
      answer:
        "सदस्यता के मुख्य फायदे हैं: 1) मृत्यु पर आर्थिक सहायता 2) व्यापारिक सलाह और मार्गदर्शन 3) सामुदायिक सहयोग 4) कानूनी सहायता 5) त्योहारों और कार्यक्रमों में भागीदारी।",
    },
    {
      question: "सदस्यता रद्द कैसे करें?",
      answer:
        "सदस्यता रद्द करने के लिए लिखित आवेदन देना होगा। हालांकि, एक बार सदस्यता लेने के बाद कम से कम 2 साल तक सदस्य बने रहना आवश्यक है। सदस्यता रद्द करने पर जमा की गई राशि वापस नहीं मिलती।",
    },
    {
      question: "क्या महिलाएं भी सदस्य बन सकती हैं?",
      answer:
        "हां, बिल्कुल! महिला मेडिकल स्टोर मालिक भी हमारी संस्था की सदस्य बन सकती हैं। सदस्यता के नियम और लाभ सभी के लिए समान हैं। हम लैंगिक समानता में विश्वास करते हैं।",
    },
    {
      question: "संस्था का मुख्यालय कहां है?",
      answer:
        "हमारा मुख्यालय गोरखपुर, उत्तर प्रदेश में स्थित है। पूरा पता: मेडिकल कॉलेज रोड, गोरखपुर - 273013। कार्यालय समय: सोमवार से शुक्रवार (9:00 AM - 6:00 PM), शनिवार (9:00 AM - 2:00 PM)।",
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
      <Navbar {...appState} />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-10 w-10 text-emerald-500" />❓ अक्सर पूछे जाने वाले प्रश्न
          </h2>
          <p className="text-xl text-gray-700">आपके सवालों के जवाब यहां हैं</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="shadow-xl rounded-2xl border-0 overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-teal-50 hover:shadow-2xl transition-all duration-300"
            >
              <CardHeader
                className="cursor-pointer hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 transition-all duration-200"
                onClick={() => toggleFAQ(index)}
              >
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="text-emerald-800 font-bold flex items-center gap-3">
                    <span className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                    {openFAQ === index ? (
                      <Minus className="h-5 w-5 text-white" />
                    ) : (
                      <Plus className="h-5 w-5 text-white" />
                    )}
                  </div>
                </CardTitle>
              </CardHeader>

              {openFAQ === index && (
                <CardContent className="pt-0 pb-6 px-6">
                  <div className="p-4 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl">
                    <p className="text-gray-700 leading-relaxed text-lg">{faq.answer}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-gradient-to-r from-blue-100 to-purple-100 border-0 rounded-3xl shadow-xl">
          <CardContent className="p-8 text-center">
            <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-blue-800 mb-4">अभी भी कोई सवाल है?</h3>
            <p className="text-blue-700 text-lg mb-6">हमसे सीधे संपर्क करें और अपनी समस्या का तुरंत समाधान पाएं</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-blue-700 font-bold">
                <span className="text-2xl">📞</span>
                <span>हेल्पलाइन: 8299001343</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700 font-bold">
                <span className="text-2xl">📧</span>
                <span>ईमेल: ppbajpai5@gmail.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

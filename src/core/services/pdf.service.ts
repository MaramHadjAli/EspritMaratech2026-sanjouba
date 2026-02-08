/**
 * OMNIA - PDF Generation Service
 * Génère des certificats de don et rapports d'impact professionnels
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// ============================================
// TYPES
// ============================================

export interface DonationPDFData {
  // Informations du certificat
  certificateNumber: string
  generatedAt: Date

  // Informations du donateur
  donor: {
    name: string
    email?: string
    phone?: string
    address?: string
  }

  // Informations de la visite/campagne
  visit: {
    id: string
    name: string
    date: Date
    location: string
    region?: string
  }

  // Famille bénéficiaire
  beneficiary: {
    familyId: string
    lastName: string
    address?: string
    numberOfMembers: number
    vulnerabilityScore?: number
  }

  // Détails des aides distribuées
  aids: {
    type: string
    name: string
    quantity: number
    unit: string
  }[]

  // Informations ONG
  organization: {
    name: string
    address: string
    phone: string
    email: string
    registrationNumber?: string
  }

  // Notes et signature
  notes?: string
  signedBy?: string
}

export interface ImpactReportPDFData {
  period: { start: Date; end: Date }
  donor: { name: string; email?: string }
  stats: {
    totalDonations: number
    totalValue: number
    familiesHelped: number
    visitsParticipated: number
  }
  donations: {
    date: Date
    type: string
    quantity: number
    beneficiaryRegion: string
  }[]
  organization: DonationPDFData['organization']
}

// ============================================
// COULEURS & CONSTANTES
// ============================================

const COLORS = {
  primary: [16, 185, 129] as [number, number, number],      // Emerald-500
  primaryDark: [5, 150, 105] as [number, number, number],   // Emerald-600
  secondary: [14, 165, 233] as [number, number, number],    // Sky-500
  text: [30, 41, 59] as [number, number, number],           // Slate-800
  textLight: [100, 116, 139] as [number, number, number],   // Slate-500
  white: [255, 255, 255] as [number, number, number],
  background: [248, 250, 252] as [number, number, number],  // Slate-50
  border: [226, 232, 240] as [number, number, number],      // Slate-200
}

const FONTS = {
  title: 24,
  subtitle: 16,
  heading: 14,
  body: 11,
  small: 9,
}

// ============================================
// SERVICE PDF
// ============================================

class PDFService {
  private doc: jsPDF | null = null

  /**
   * Génère un certificat de don PDF
   */
  generateDonationCertificate(data: DonationPDFData): void {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = this.doc.internal.pageSize.getWidth()
    const pageHeight = this.doc.internal.pageSize.getHeight()
    const margin = 20
    let y = margin

    // Bordure décorative
    this.drawDecorativeBorder(pageWidth, pageHeight)

    // En-tête avec logo
    y = this.drawHeader(data.organization, pageWidth, margin, y)

    // Titre du certificat
    y = this.drawCertificateTitle(pageWidth, y)

    // Numéro et date du certificat
    y = this.drawCertificateInfo(data.certificateNumber, data.generatedAt, pageWidth, y)

    // Section donateur
    y = this.drawDonorSection(data.donor, margin, y, pageWidth)

    // Section visite/campagne
    y = this.drawVisitSection(data.visit, margin, y, pageWidth)

    // Section bénéficiaire
    y = this.drawBeneficiarySection(data.beneficiary, margin, y, pageWidth)

    // Tableau des aides
    y = this.drawAidsTable(data.aids, margin, y, pageWidth)

    // Notes
    if (data.notes) {
      y = this.drawNotes(data.notes, margin, y, pageWidth)
    }

    // Signature et cachet
    y = this.drawSignatureSection(data.signedBy, data.organization.name, margin, y, pageWidth, pageHeight)

    // Pied de page
    this.drawFooter(data.organization, pageWidth, pageHeight)

    // Téléchargement
    const fileName = `OMNIA_Certificat_${data.certificateNumber}_${format(data.generatedAt, 'yyyyMMdd')}.pdf`
    this.doc.save(fileName)
  }

  /**
   * Génère un rapport d'impact PDF
   */
  generateImpactReport(data: ImpactReportPDFData): void {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = this.doc.internal.pageSize.getWidth()
    const pageHeight = this.doc.internal.pageSize.getHeight()
    const margin = 20
    let y = margin

    // Bordure
    this.drawDecorativeBorder(pageWidth, pageHeight)

    // En-tête
    y = this.drawHeader(data.organization, pageWidth, margin, y)

    // Titre
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(FONTS.title)
    this.doc.setTextColor(...COLORS.primaryDark)
    this.doc.text('RAPPORT D\'IMPACT', pageWidth / 2, y, { align: 'center' })
    y += 10

    // Période
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(FONTS.body)
    this.doc.setTextColor(...COLORS.textLight)
    const periodText = `Période: ${format(data.period.start, 'dd MMMM yyyy', { locale: fr })} - ${format(data.period.end, 'dd MMMM yyyy', { locale: fr })}`
    this.doc.text(periodText, pageWidth / 2, y, { align: 'center' })
    y += 15

    // Carte de statistiques
    y = this.drawStatsCards(data.stats, margin, y, pageWidth)

    // Tableau des donations
    y = this.drawDonationsTable(data.donations, margin, y, pageWidth)

    // Message de remerciement
    y += 10
    this.doc.setFont('helvetica', 'italic')
    this.doc.setFontSize(FONTS.body)
    this.doc.setTextColor(...COLORS.primary)
    const thankYou = `Merci ${data.donor.name} pour votre générosité et votre engagement solidaire.`
    this.doc.text(thankYou, pageWidth / 2, y, { align: 'center', maxWidth: pageWidth - 2 * margin })

    // Pied de page
    this.drawFooter(data.organization, pageWidth, pageHeight)

    const fileName = `OMNIA_Rapport_Impact_${format(new Date(), 'yyyyMMdd')}.pdf`
    this.doc.save(fileName)
  }

  // ============================================
  // MÉTHODES PRIVÉES
  // ============================================

  private drawDecorativeBorder(pageWidth: number, pageHeight: number): void {
    if (!this.doc) return

    // Bordure extérieure
    this.doc.setDrawColor(...COLORS.primary)
    this.doc.setLineWidth(1)
    this.doc.rect(10, 10, pageWidth - 20, pageHeight - 20)

    // Coins décoratifs
    const cornerSize = 15
    this.doc.setFillColor(...COLORS.primary)
    
    // Coin supérieur gauche
    this.doc.triangle(10, 10, 10 + cornerSize, 10, 10, 10 + cornerSize, 'F')
    // Coin supérieur droit
    this.doc.triangle(pageWidth - 10, 10, pageWidth - 10 - cornerSize, 10, pageWidth - 10, 10 + cornerSize, 'F')
    // Coin inférieur gauche
    this.doc.triangle(10, pageHeight - 10, 10 + cornerSize, pageHeight - 10, 10, pageHeight - 10 - cornerSize, 'F')
    // Coin inférieur droit
    this.doc.triangle(pageWidth - 10, pageHeight - 10, pageWidth - 10 - cornerSize, pageHeight - 10, pageWidth - 10, pageHeight - 10 - cornerSize, 'F')
  }

  private drawHeader(org: DonationPDFData['organization'], pageWidth: number, margin: number, y: number): number {
    if (!this.doc) return y

    // Logo circulaire simulé
    const logoX = pageWidth / 2
    const logoY = y + 12
    const logoRadius = 12

    // Cercle de fond avec dégradé simulé
    this.doc.setFillColor(...COLORS.primary)
    this.doc.circle(logoX, logoY, logoRadius, 'F')
    this.doc.setFillColor(...COLORS.secondary)
    this.doc.circle(logoX + 3, logoY - 3, logoRadius - 4, 'F')

    // Emoji/Icône au centre
    this.doc.setFontSize(16)
    this.doc.setTextColor(...COLORS.white)
    this.doc.text('🌍', logoX, logoY + 2, { align: 'center' })

    y += 28

    // Nom de l'organisation
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(FONTS.subtitle)
    this.doc.setTextColor(...COLORS.primaryDark)
    this.doc.text(org.name, pageWidth / 2, y, { align: 'center' })
    y += 6

    // Infos organisation
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(FONTS.small)
    this.doc.setTextColor(...COLORS.textLight)
    this.doc.text(`${org.address} | ${org.phone} | ${org.email}`, pageWidth / 2, y, { align: 'center' })
    y += 4

    if (org.registrationNumber) {
      this.doc.text(`N° Enregistrement: ${org.registrationNumber}`, pageWidth / 2, y, { align: 'center' })
      y += 4
    }

    // Ligne de séparation
    y += 4
    this.doc.setDrawColor(...COLORS.border)
    this.doc.setLineWidth(0.5)
    this.doc.line(margin, y, pageWidth - margin, y)
    y += 8

    return y
  }

  private drawCertificateTitle(pageWidth: number, y: number): number {
    if (!this.doc) return y

    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(FONTS.title)
    this.doc.setTextColor(...COLORS.primaryDark)
    this.doc.text('CERTIFICAT DE DON', pageWidth / 2, y, { align: 'center' })
    y += 5

    // Sous-titre
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(FONTS.body)
    this.doc.setTextColor(...COLORS.textLight)
    this.doc.text('Attestation de distribution d\'aide humanitaire', pageWidth / 2, y, { align: 'center' })
    y += 12

    return y
  }

  private drawCertificateInfo(certNumber: string, date: Date, pageWidth: number, y: number): number {
    if (!this.doc) return y

    const boxWidth = 80
    const boxHeight = 12
    const boxX = (pageWidth - boxWidth) / 2

    // Box avec numéro de certificat
    this.doc.setFillColor(...COLORS.background)
    this.doc.setDrawColor(...COLORS.border)
    this.doc.roundedRect(boxX, y, boxWidth, boxHeight, 3, 3, 'FD')

    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(FONTS.small)
    this.doc.setTextColor(...COLORS.text)
    this.doc.text(`N° ${certNumber}`, pageWidth / 2, y + 5, { align: 'center' })

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(FONTS.small)
    this.doc.setTextColor(...COLORS.textLight)
    this.doc.text(format(date, 'dd MMMM yyyy à HH:mm', { locale: fr }), pageWidth / 2, y + 9, { align: 'center' })

    y += boxHeight + 10

    return y
  }

  private drawDonorSection(donor: DonationPDFData['donor'], margin: number, y: number, pageWidth: number): number {
    if (!this.doc) return y

    y = this.drawSectionHeader('DONATEUR / DISTRIBUTEUR', margin, y, pageWidth)

    const contentX = margin + 5
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(FONTS.body)
    this.doc.setTextColor(...COLORS.text)

    this.doc.text(`Nom: ${donor.name}`, contentX, y)
    y += 5

    if (donor.email) {
      this.doc.text(`Email: ${donor.email}`, contentX, y)
      y += 5
    }

    if (donor.phone) {
      this.doc.text(`Téléphone: ${donor.phone}`, contentX, y)
      y += 5
    }

    if (donor.address) {
      this.doc.text(`Adresse: ${donor.address}`, contentX, y)
      y += 5
    }

    y += 5
    return y
  }

  private drawVisitSection(visit: DonationPDFData['visit'], margin: number, y: number, pageWidth: number): number {
    if (!this.doc) return y

    y = this.drawSectionHeader('VISITE / CAMPAGNE', margin, y, pageWidth)

    const contentX = margin + 5
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(FONTS.body)
    this.doc.setTextColor(...COLORS.text)

    this.doc.text(`Campagne: ${visit.name}`, contentX, y)
    y += 5

    this.doc.text(`Date: ${format(visit.date, 'EEEE dd MMMM yyyy', { locale: fr })}`, contentX, y)
    y += 5

    this.doc.text(`Lieu: ${visit.location}${visit.region ? ` (${visit.region})` : ''}`, contentX, y)
    y += 5

    this.doc.setTextColor(...COLORS.textLight)
    this.doc.setFontSize(FONTS.small)
    this.doc.text(`Réf. visite: ${visit.id}`, contentX, y)
    y += 8

    return y
  }

  private drawBeneficiarySection(beneficiary: DonationPDFData['beneficiary'], margin: number, y: number, pageWidth: number): number {
    if (!this.doc) return y

    y = this.drawSectionHeader('BÉNÉFICIAIRE', margin, y, pageWidth)

    const contentX = margin + 5
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(FONTS.body)
    this.doc.setTextColor(...COLORS.text)

    this.doc.text(`Famille: ${beneficiary.lastName}`, contentX, y)
    y += 5

    this.doc.text(`Membres: ${beneficiary.numberOfMembers} personnes`, contentX, y)
    y += 5

    if (beneficiary.address) {
      this.doc.text(`Adresse: ${beneficiary.address}`, contentX, y)
      y += 5
    }

    if (beneficiary.vulnerabilityScore !== undefined) {
      const vulnLabel = beneficiary.vulnerabilityScore >= 70 ? 'Très vulnérable' : beneficiary.vulnerabilityScore >= 40 ? 'Vulnérable' : 'Modéré'
      this.doc.text(`Indice de vulnérabilité: ${beneficiary.vulnerabilityScore}/100 (${vulnLabel})`, contentX, y)
      y += 5
    }

    this.doc.setTextColor(...COLORS.textLight)
    this.doc.setFontSize(FONTS.small)
    this.doc.text(`Réf. famille: ${beneficiary.familyId}`, contentX, y)
    y += 8

    return y
  }

  private drawAidsTable(aids: DonationPDFData['aids'], margin: number, y: number, pageWidth: number): number {
    if (!this.doc) return y

    y = this.drawSectionHeader('AIDES DISTRIBUÉES', margin, y, pageWidth)

    const tableData = aids.map((aid, index) => [
      (index + 1).toString(),
      aid.type,
      aid.name,
      `${aid.quantity} ${aid.unit}`,
    ])

    autoTable(this.doc, {
      startY: y,
      head: [['#', 'Type', 'Description', 'Quantité']],
      body: tableData,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: FONTS.body,
        cellPadding: 3,
        textColor: COLORS.text,
        lineColor: COLORS.border,
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: COLORS.background,
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 35 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 30, halign: 'right' },
      },
    })

    // @ts-ignore - autoTable ajoute cette propriété
    y = this.doc.lastAutoTable.finalY + 10

    return y
  }

  private drawNotes(notes: string, margin: number, y: number, pageWidth: number): number {
    if (!this.doc) return y

    y = this.drawSectionHeader('NOTES', margin, y, pageWidth)

    this.doc.setFont('helvetica', 'italic')
    this.doc.setFontSize(FONTS.body)
    this.doc.setTextColor(...COLORS.textLight)
    
    const splitNotes = this.doc.splitTextToSize(notes, pageWidth - 2 * margin - 10)
    this.doc.text(splitNotes, margin + 5, y)
    y += splitNotes.length * 5 + 5

    return y
  }

  private drawSignatureSection(signedBy: string | undefined, orgName: string, margin: number, y: number, pageWidth: number, pageHeight: number): number {
    if (!this.doc) return y

    // S'assurer qu'on a assez d'espace, sinon positionner en bas de page
    const signatureY = Math.max(y + 10, pageHeight - 60)

    const colWidth = (pageWidth - 2 * margin) / 2

    // Cachet (gauche)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(FONTS.small)
    this.doc.setTextColor(...COLORS.text)
    this.doc.text('Cachet de l\'organisation', margin + colWidth / 2, signatureY, { align: 'center' })

    // Cercle pour cachet
    this.doc.setDrawColor(...COLORS.primary)
    this.doc.setLineWidth(0.5)
    this.doc.circle(margin + colWidth / 2, signatureY + 15, 12)
    this.doc.setFontSize(8)
    this.doc.setTextColor(...COLORS.primary)
    this.doc.text(orgName.substring(0, 10), margin + colWidth / 2, signatureY + 16, { align: 'center' })

    // Signature (droite)
    const signX = margin + colWidth + colWidth / 2
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(FONTS.small)
    this.doc.setTextColor(...COLORS.text)
    this.doc.text('Signature du responsable', signX, signatureY, { align: 'center' })

    // Ligne de signature
    this.doc.setDrawColor(...COLORS.textLight)
    this.doc.line(signX - 30, signatureY + 18, signX + 30, signatureY + 18)

    if (signedBy) {
      this.doc.setFont('helvetica', 'italic')
      this.doc.setFontSize(FONTS.small)
      this.doc.text(signedBy, signX, signatureY + 24, { align: 'center' })
    }

    return signatureY + 30
  }

  private drawFooter(org: DonationPDFData['organization'], pageWidth: number, pageHeight: number): void {
    if (!this.doc) return

    const footerY = pageHeight - 18

    // Ligne de séparation
    this.doc.setDrawColor(...COLORS.border)
    this.doc.setLineWidth(0.3)
    this.doc.line(20, footerY - 5, pageWidth - 20, footerY - 5)

    // Texte du footer
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(8)
    this.doc.setTextColor(...COLORS.textLight)

    this.doc.text(
      `Ce document est un certificat officiel délivré par ${org.name}.`,
      pageWidth / 2,
      footerY,
      { align: 'center' }
    )

    this.doc.text(
      'Généré automatiquement par OMNIA Charity Tracking System',
      pageWidth / 2,
      footerY + 4,
      { align: 'center' }
    )

    // Icône et slogan
    this.doc.setTextColor(...COLORS.primary)
    this.doc.text('🌍 Ensemble pour un impact réel', pageWidth / 2, footerY + 8, { align: 'center' })
  }

  private drawSectionHeader(title: string, margin: number, y: number, pageWidth: number): number {
    if (!this.doc) return y

    // Ligne colorée à gauche
    this.doc.setFillColor(...COLORS.primary)
    this.doc.rect(margin, y - 1, 3, 6, 'F')

    // Titre de section
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(FONTS.heading)
    this.doc.setTextColor(...COLORS.primaryDark)
    this.doc.text(title, margin + 6, y + 3)

    // Ligne sous le titre
    this.doc.setDrawColor(...COLORS.border)
    this.doc.setLineWidth(0.3)
    this.doc.line(margin, y + 6, pageWidth - margin, y + 6)

    return y + 12
  }

  private drawStatsCards(stats: ImpactReportPDFData['stats'], margin: number, y: number, pageWidth: number): number {
    if (!this.doc) return y

    const cardWidth = (pageWidth - 2 * margin - 15) / 4
    const cardHeight = 25

    const statsData = [
      { label: 'Dons', value: stats.totalDonations.toString(), icon: '🎁' },
      { label: 'Valeur (TND)', value: stats.totalValue.toLocaleString('fr-TN'), icon: '💰' },
      { label: 'Familles', value: stats.familiesHelped.toString(), icon: '👨‍👩‍👧‍👦' },
      { label: 'Visites', value: stats.visitsParticipated.toString(), icon: '📍' },
    ]

    statsData.forEach((stat, index) => {
      const x = margin + index * (cardWidth + 5)

      // Fond de la carte
      this.doc!.setFillColor(...COLORS.background)
      this.doc!.setDrawColor(...COLORS.primary)
      this.doc!.setLineWidth(0.5)
      this.doc!.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'FD')

      // Icône
      this.doc!.setFontSize(12)
      this.doc!.text(stat.icon, x + cardWidth / 2, y + 8, { align: 'center' })

      // Valeur
      this.doc!.setFont('helvetica', 'bold')
      this.doc!.setFontSize(FONTS.heading)
      this.doc!.setTextColor(...COLORS.primaryDark)
      this.doc!.text(stat.value, x + cardWidth / 2, y + 16, { align: 'center' })

      // Label
      this.doc!.setFont('helvetica', 'normal')
      this.doc!.setFontSize(FONTS.small)
      this.doc!.setTextColor(...COLORS.textLight)
      this.doc!.text(stat.label, x + cardWidth / 2, y + 22, { align: 'center' })
    })

    return y + cardHeight + 10
  }

  private drawDonationsTable(donations: ImpactReportPDFData['donations'], margin: number, y: number, pageWidth: number): number {
    if (!this.doc) return y

    y = this.drawSectionHeader('DÉTAIL DES CONTRIBUTIONS', margin, y, pageWidth)

    const tableData = donations.map((d, i) => [
      (i + 1).toString(),
      format(d.date, 'dd/MM/yyyy', { locale: fr }),
      d.type,
      d.quantity.toString(),
      d.beneficiaryRegion,
    ])

    autoTable(this.doc, {
      startY: y,
      head: [['#', 'Date', 'Type', 'Qté', 'Région']],
      body: tableData,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: FONTS.small,
        cellPadding: 2,
        textColor: COLORS.text,
        lineColor: COLORS.border,
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: COLORS.background,
      },
    })

    // @ts-ignore
    return this.doc.lastAutoTable.finalY + 5
  }
}

// Export singleton
export const pdfService = new PDFService()

// Export types et fonction utilitaire
export const generateDonationPDF = (data: DonationPDFData) => pdfService.generateDonationCertificate(data)
export const generateImpactReportPDF = (data: ImpactReportPDFData) => pdfService.generateImpactReport(data)

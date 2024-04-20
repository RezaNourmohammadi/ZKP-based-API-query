import { F, F2, G2 } from '..'
import bigInt = require('big-integer')
import { expect } from 'chai'
import 'mocha'

describe('g2', () => {
  it('should test equality', () => {
    const x = F2.fromElements(
      F.fromString('76745928734058098911206082302592658587915017598927210264412635094391169612019076805483649351213088059211330339445'),
      F.fromString('22704743140596388362560610506687295548304578202723531165383997861774034997996844795459245775944739630953111054630'),
    )
    const y = F2.fromElements(
      F.fromString('71747295021161167426102815770596871548794746292009393159875610303966118651206300523042432559329450081714564918434'),
      F.fromString('106688326169291081347478795891491681781176448520120856105586966427896976964188782420011729157745301596613076838664'),
    )
    const p = G2.fromElements(x, y)
    const x2 = F2.fromElements(
      F.fromString('203718394405851942883218927977300499602433480119740961495667601150363295639494017634274488469250882215690684266777'),
      F.fromString('183711022351463541335701044346277465375454792680582516343676551741080726804443665048259076243232075595472382969991'),
    )
    const y2 = F2.fromElements(
      F.fromString('76247137801970706159019542550651244132206947243440057109443497704171037333321691859111567774352087571992061403067'),
      F.fromString('199272143746481716875556128070833429767511817925379078209323944663677114828160792529684605761581720891864856912519'),
    )
    const p2 = G2.fromElements(x2, y2)
    expect(p.equals(p)).to.be.true
    expect(p.equals(p2)).to.be.false
  })

  it('should add correctly', () => {
    const x = F2.fromElements(
      F.fromString('76745928734058098911206082302592658587915017598927210264412635094391169612019076805483649351213088059211330339445'),
      F.fromString('22704743140596388362560610506687295548304578202723531165383997861774034997996844795459245775944739630953111054630'),
    )
    const y = F2.fromElements(
      F.fromString('71747295021161167426102815770596871548794746292009393159875610303966118651206300523042432559329450081714564918434'),
      F.fromString('106688326169291081347478795891491681781176448520120856105586966427896976964188782420011729157745301596613076838664'),
    )
    const p = G2.fromElements(x, y)
    const x2 = F2.fromElements(
      F.fromString('203718394405851942883218927977300499602433480119740961495667601150363295639494017634274488469250882215690684266777'),
      F.fromString('183711022351463541335701044346277465375454792680582516343676551741080726804443665048259076243232075595472382969991'),
    )
    const y2 = F2.fromElements(
      F.fromString('76247137801970706159019542550651244132206947243440057109443497704171037333321691859111567774352087571992061403067'),
      F.fromString('199272143746481716875556128070833429767511817925379078209323944663677114828160792529684605761581720891864856912519'),
    )
    const p2 = G2.fromElements(x2, y2)
    const x3 = F2.fromElements(
      F.fromString('154478479599640914313997833100196006599689130408121412319477034231445144693490721115880109120549708967615978177096'),
      F.fromString('121619577725329128858302269682350046954706942602899596252063462395480801091564126871991261897894245448835668382348'),
    )
    const y3 = F2.fromElements(
      F.fromString('72335900249348591496967186733771201020005906284305174257333238360889549565442350028337471179547631309939650785985'),
      F.fromString('163159306144609124499602446840269023479807747668394609451473361700452809090349500193334301608450716054091347433093'),
    )
    const p3 = G2.fromElements(x3, y3)
    expect(p3.equals(p.add(p2))).to.be.true
    expect(p3.equals(p.add(p))).to.be.false
  })

  it('should double correctly', () => {
    const x = F2.fromElements(
      F.fromString('76745928734058098911206082302592658587915017598927210264412635094391169612019076805483649351213088059211330339445'),
      F.fromString('22704743140596388362560610506687295548304578202723531165383997861774034997996844795459245775944739630953111054630'),
    )
    const y = F2.fromElements(
      F.fromString('71747295021161167426102815770596871548794746292009393159875610303966118651206300523042432559329450081714564918434'),
      F.fromString('106688326169291081347478795891491681781176448520120856105586966427896976964188782420011729157745301596613076838664'),
    )
    const p = G2.fromElements(x, y)
    const x2 = F2.fromElements(
      F.fromString('221821312287048702465248032936612118309690099423323545668907136102394869990438617103298529758269174710392694495634'),
      F.fromString('24294763667222445990009038907800119790657653682831066337956313633113670969066209156457737639546455033869225959400'),
    )
    const y2 = F2.fromElements(
      F.fromString('36468687631186267392778616946755038649328879644326516437830287104143274066002380037493992739753562588647358752061'),
      F.fromString('251380497806901487778566685315621404108731880569670799900798483084840920943563062567503802897008795326519679273340'),
    )
    const p2 = G2.fromElements(x2, y2)
    expect(p2.equals(p.add(p))).to.be.true
    expect(p2.equals(p.dbl())).to.be.true
    expect(p2.equals(p.dbl().dbl())).to.be.false
  })

  it('should scalar multiply correctly', () => {
    const x = F2.fromElements(
      F.fromString('76745928734058098911206082302592658587915017598927210264412635094391169612019076805483649351213088059211330339445'),
      F.fromString('22704743140596388362560610506687295548304578202723531165383997861774034997996844795459245775944739630953111054630'),
    )
    const y = F2.fromElements(
      F.fromString('71747295021161167426102815770596871548794746292009393159875610303966118651206300523042432559329450081714564918434'),
      F.fromString('106688326169291081347478795891491681781176448520120856105586966427896976964188782420011729157745301596613076838664'),
    )
    const p = G2.fromElements(x, y)
    const x2 = F2.fromElements(
      F.fromString('177219973049429928933271787665417104136777958764692201653139915025383483150521068453684849316253186229448189382742'),
      F.fromString('34963629085818428155408674252918481740293040698560426456819619940377278698303698822620782262730871269377525866974'),
    )
    const y2 = F2.fromElements(
      F.fromString('222176108703204763320132911887168896883807417674363477981543185965131788860953266759356524294400485202057532733971'),
      F.fromString('154269994386236544928821879703317753347185265162446123453161831923274031737019361147340584170648785179691496475461'),
    )
    const p2 = G2.fromElements(x2, y2)
    expect(p2.equals(p.scalarMult(bigInt(5)))).to.be.false
    expect(p2.equals(p.scalarMult(bigInt(20)))).to.be.true
  })
})
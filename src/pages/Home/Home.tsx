import { useState } from "react";
import { styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { scroller, Element } from "react-scroll";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import LoadingButton from "@mui/lab/LoadingButton";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Obfuscate from "react-obfuscate";
import CallIcon from "@mui/icons-material/Call";
import DcpCarousel from "../../components/DcpCarousel";
import Hero from "../../components/Hero";
import DcpPhoneInput from "../../components/DcpPhoneInput";

const drawerWidth = 240;

const StyledToolbar = styled(Toolbar)(() => ({
  alignItems: "flex-end",
  flexDirection: "column",
  paddingTop: "16px",
  // Override media queries injected by theme.mixins.toolbar
  "@media all": {
    justifyContent: "center",
  },
}));

type Inputs = {
  name: string;
  email: string;
  mobile: string;
  emailText: string;
};

const defaultValues = {
  name: "",
  email: "",
  mobile: "+49",
  emailText: "",
};

export default function Home() {
  const theme = useTheme();
  const matchMedium = useMediaQuery(theme.breakpoints.down("md"));
  const matchSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [value, setValue] = useState("section_1");
  const handleChange = (newValue: string) => {
    setValue(newValue);
    scroller.scrollTo(newValue, {
      duration: 1000,
      delay: 100,
      smooth: true,
      containerId: "body",
      offset: -100, // Scrolls to element + 50 pixels down the page
    });
  };

  const [isSubmitting, setIsSubmitting] = useState<true | false>(false);
  const [submitted, setSubmitted] = useState<undefined | true | false>(
    undefined
  );
  const methods = useForm<Inputs>({
    defaultValues,
    mode: "all",
    reValidateMode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setIsSubmitting(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch("/request/quotation", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(() => {
        setSubmitted(true);
      })
      .catch(() => {
        setSubmitted(false);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem
          button
          key="Telefonnummer"
          onClick={() => {
            handleChange("section_1");
          }}
        >
          <CallIcon sx={{ mr: 1 }} />
          <Obfuscate
            style={{
              color: "inherit",
              textDecoration: "inherit",
              minWidth: "169px",
            }}
            tel={process.env.REACT_APP_OWNER_TEL}
          />
        </ListItem>
        {[
          "Start",
          "??ber uns",
          "Dienstleistungen",
          "Bewertungen",
          "Kontakt",
        ].map((text, index) => (
          <ListItem
            button
            key={text}
            onClick={() => {
              handleChange(`section_${index + 1}`);
            }}
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
        }}
      >
        <Toolbar>
          <Link
            style={{ color: "inherit", textDecoration: "inherit" }}
            to="/"
            onClick={() => {
              handleChange("section_1");
            }}
          >
            <img
              style={{
                verticalAlign: "bottom",
                maxHeight: matchSmall ? 40 : 47,
              }}
              src={matchSmall ? "/logo_white_small.png" : "/logo_white.png"}
              alt={`brand for ${process.env.REACT_APP_SITE_NAME}`}
            />
          </Link>
          <Box sx={{ flexGrow: 1 }}></Box>
          {!matchMedium ? (
            <Tabs
              value={value}
              onChange={(_event: any, value: any) => {
                handleChange(value);
              }}
              aria-label="nav tabs"
              textColor="inherit"
              TabIndicatorProps={{ style: { backgroundColor: "white" } }}
            >
              <Tab label="Start" value={"section_1"} />
              <Tab label="??ber uns" value={"section_2"} />
              <Tab label="Dienstleistungen" value={"section_3"} />
              <Tab label="Bewertungen" value={"section_4"} />
              <Tab label="Kontakt" value={"section_5"} />
            </Tabs>
          ) : null}

          {!matchSmall ? (
            <>
              <CallIcon sx={{ ml: 3, mr: 1 }} />
              <Obfuscate
                style={{
                  color: "inherit",
                  textDecoration: "inherit",
                  minWidth: "169px",
                }}
                tel={process.env.REACT_APP_OWNER_TEL}
              />
            </>
          ) : null}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ ml: 1, mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Element name="section_1">
        <Toolbar />
        <Hero onChange={handleChange} />
        <Container maxWidth="lg">
          <Element name="section_2">
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{ fontWeight: "light", mb: 0, mt: !matchMedium ? 6 : 4 }}
            >
              ??BER UNS
            </Typography>
            <Grid container spacing={2} sx={{ mt: !matchMedium ? 1 : 0 }}>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: { md: "block", xs: "none" },
                }}
              >
                <Card
                  sx={{
                    maxWidth: "100%",
                    borderRadius: "4px",
                  }}
                >
                  <CardMedia
                    component="img"
                    image="/profile_picture.jpg"
                    alt="image about us"
                    loading="lazy"
                  />
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography paragraph align="justify">
                  Mit ALALI-BAU sind wir als Familienunternehmen schon seit 10
                  Jahren erfolgreich in der Baubranche t??tig. Wir entwickeln f??r
                  unsere Kunden ma??geschneiderte L??sungen rund um das Thema
                  Bau-, Reparatur- und Montagearbeiten. Wir garantieren unseren
                  Kunden eine individuelle Herangehensweise und ein auf ihn
                  zugeschnittenes Angebot. Unser Ziel ist es einen bleibenden
                  und positiven Eindruck zu hinterlassen.
                </Typography>
                <Card
                  sx={{
                    maxWidth: "100%",
                    borderRadius: "4px",
                    display: { md: "none", sm: "block" },
                    mb: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    image="/profile_picture.jpg"
                    alt="image about us"
                    loading="lazy"
                  />
                </Card>
                <Typography paragraph align="justify">
                  Unser Unternehmen asphaltiert seit etwa zehn Jahren Stra??en
                  regional und ??berregional und hat sich auf dem Markt f??r die
                  damit verbundenen Dienstleistungen einen tadellosen Ruf
                  erarbeitet. F??r uns gibt es keine kleinen oder unm??glichen
                  Auftr??ge: Wir ??bernehmen den Bau von Stra??en - unabh??ngig vom
                  Bestimmungsort - sowie deren Reparatur. Wir bieten unseren
                  Kunden ein breites Portfolio an Dienstleistungen. So bieten
                  wir beispielsweise Arbeiten als Asphaltierier,
                  Betonbohrer/-schneider, Bodenleger, Einbauer genormter
                  Baufertigteile, Fuger, Holz-/Bautensch??tzer, Kabelverleger,
                  Rohr-/Kanalreiniger und Arbeiten zur Bautentrocknung an.
                </Typography>
              </Grid>
            </Grid>
          </Element>
          <Element name="section_3">
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{ fontWeight: "light", mb: 0, mt: !matchMedium ? 4 : 2 }}
            >
              DIENSTLEISTUNGEN
            </Typography>
            <Grid container spacing={4} sx={{ mt: 0 }}>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  align="center"
                >
                  ASPHALTIERUNG
                </Typography>
                <Typography align="justify">
                  Die Asphaltierung ist ein moderner Ansatz zur Verbesserung von
                  Stra??en und Gehwegen. Es ist eine Aufgabe, die keine Fehler
                  duldet. So ist beispielsweise der Einbau von Hei??asphalt mit
                  einer strikten Einhaltung der Technik verbunden, da eine
                  Mischung schnell ausk??hlt. Dies bedeutet, dass es z??gig und
                  exakt auf den vorbereiteten Untergrund verlegt werden muss, da
                  sonst der Asphalteinbau unn??tige Kosten und mehr Zeit in
                  Anspruch nimmt.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  align="center"
                >
                  BAUTENTROCKNUNG
                </Typography>
                <Typography align="justify">
                  Wir sind Experten f??r die Entfeuchtung und Trocknung von
                  W??nden und R??umen. Wir arbeiten mit beliebigen Objekten:
                  Wohnungen, Privath??user, B??ros, Produktionsr??ume, D??cher,
                  Keller, Sockel usw. Im Laufe der Jahre haben wir umfangreiche
                  Erfahrung f??r schnelle L??sungen im Fall einer ??berschwemmung
                  oder bei der Bildung von Schimmel gesammelt. F??r jeden
                  konkreten Fall w??hlen wir eine effiziente L??sung, damit die
                  Entfeuchtung zu 100% effektiv ist.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  align="center"
                >
                  BETONBOHREN UND -SCHNEIDEN
                </Typography>
                <Typography align="justify">
                  Wenn in Stein, Mauerwerk, Beton und Stahlbeton effiziert
                  geborhrt werden soll, ist es unabdinglich S??gebl??tter mit
                  Diamantbesetzung einzusetzen. Das Bohren mit Diamantbohrern
                  ist bei jeder Dicke von W??nden, Bodenplatten oder Fundamenten
                  m??glich. Zudem bieten wir mittels Nassverfahren und
                  entsprechender Saugvorrichtung eine staubfreie Umsetzung. Was
                  auch immer die anstehende Aufgabe ist, wir bieten etablierte
                  Wege, diese zu l??sen.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  align="center"
                >
                  BODENBELAGSARBEITEN
                </Typography>
                <Typography align="justify">
                  Eine Bodenverlegung ist eine verantwortungsvolle Aufgabe, die
                  am besten gleich von Profis erledigt wird. Die Behaglichkeit
                  und der Komfort des Wohnens sowie die Lebensdauer des Bodens
                  h??ngen von der Qualit??t der ausgef??hrten Umsetzung ab. Wir
                  bieten einen Service f??r die Verlegung und Reparatur von
                  Bodenbel??gen wie beispielsweise Laminat, Parkett, Linoleum,
                  Quarz-Vinyl-Fliesen und Teppich. Wir f??hren die Arbeiten
                  qualitativ hochwertig und im vereinbarten Zeitrahmen aus.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  align="center"
                >
                  MONTAGESERVICE
                </Typography>
                <Typography align="justify">
                  Eine professionelle Montage von Fenstern, T??ren, Zargen und
                  Regalen erfordert das Heranziehen eines hochqualifizierten
                  Spezialisten mit langj??hriger Erfahrung. Denn die Stille und
                  W??rme im Haus h??ngen eben von der Qualit??t solcher
                  Einbauarbeiten ab. Egal ob Fenster, Fensterb??nke, T??ren oder
                  Gel??nder, wir bieten Ihnen einen hochwertigen und
                  vielschichtigen Einbau und sorgen somit f??r einen erh??hten
                  Wohnkomfort, der sich bezahlt macht.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  align="center"
                >
                  VERFUGEN
                </Typography>
                <Typography align="justify">
                  Wir bieten ein Ausf??llen und Abdichten von Fugen im Mauerwerk
                  zwischen Betonbauteilen und Fassadenteilen, sowie bei
                  Fenster-, Balkon- und Terrassenabdichtungen an. Eine
                  Abdichtung erfolgt in der Regel mit spritzbaren,
                  dauerelastischen Dehnungsdichtstoffen, wie beispielsweise
                  Silikon und Acryl. Verfugmassen wie Zement und M??rtel setzen
                  wir beispielsweise beim Verfugen von Sichtmauerwerk ein.
                  Diesen Dienst bieten wir sowohl bei einer Erstverfugung in neu
                  errichteten Geb??uden als auch bei einer Geb??udesanierung an.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  align="center"
                >
                  HOLZ- UND BAUTENSCHUTZ
                </Typography>
                <Typography align="justify">
                  Holz ist ein dem Menschen vertrauter Naturstoff, daher f??hlt
                  man sich in einem Holzhaus am wohlsten. Jedoch hat es zwar
                  neben den unbestrittenen Vorteilen auch eine Reihe von
                  Nachteilen: Es brennt leicht und ist auch anf??llig f??r die
                  Auswirkungen von Pilzen, Bakterien, Schimmelpilzen,
                  Insektensch??dlingen usw. Gerade deshalb ist eine Beschichtung
                  der Oberfl??chen mit verschiedenen Schutzmitteln unabdinglich.
                  Dieses Problem l??sen wir mit Hilfe von Impr??gnierungen und
                  Verbindungen.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  align="center"
                >
                  KABELVERLEGUNG
                </Typography>
                <Typography align="justify">
                  Eine Kabelverlegung geh??rt zweifelsohne zu den
                  sicherheitskritischen Aufgaben und erfordert daher das
                  Heranziehen eines hochqualifizierten Spezialisten mit
                  langj??hriger Erfahrung. Und genau diese Erfahrung bringen wir
                  mit. So bieten wir eine Verlegung und Installation von Kabeln
                  und Kabelkan??len an. Hierbei ist eine der Phasen beim Verlegen
                  von Freileitungen und Kabelstromleitungen die Installation von
                  Dr??hten auf zuvor aufgestellten St??tzen. Dabei f??hren unsere
                  Spezialisten diese Arbeiten unter Ber??cksichtigung aktueller
                  Industriestandards durch.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  align="center"
                >
                  ROHR- UND KANALREINIGUNG
                </Typography>
                <Typography align="justify">
                  Wir bieten eine hochwertige Reinigung und Sp??lung des
                  Abwassersystems, der Rohrleitungen, der Heizungen und der
                  Leitungen f??r die Wasserversorgung. Dabei verwenden wir
                  hydrodynamische und mechanische Methoden. Eine leistungsstarke
                  Pumpe, die nicht nur Fl??ssigkeit, sondern auch
                  Schlammablagerungen abpumpt findet dabei Einsatz. Bei Bedarf
                  bieten wir auch eine Videoaufnahme von den Abschnitten des
                  Kanalnetzes an.
                </Typography>
              </Grid>
            </Grid>
          </Element>
          <Element name="section_4">
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                fontWeight: "light",
                mb: !matchMedium ? 3 : 2,
                mt: 4,
              }}
            >
              BEWERTUNGEN
            </Typography>
            <Paper elevation={1} sx={{ mb: 2 }}>
              <DcpCarousel />
            </Paper>
          </Element>
          <Element name="section_5">
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                fontWeight: "light",
                mb: !matchMedium ? 3 : 2,
                mt: !matchMedium ? 6 : 5,
              }}
            >
              GRATIS ANGEBOT EINHOLEN
            </Typography>
            <FormProvider {...methods}>
              <Box
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Card>
                  <CardHeader
                    title="Kontakt formular"
                    subheader="Kontaktieren Sie uns jetzt! Wir rufen Sie umgehend zur??ck und bem??hen uns
                  all Ihre Fragen zu beantworten. Anschlie??end erstellen wir
                  Ihnen ein individuelles Angebot."
                    sx={{
                      pb: 0,
                    }}
                    align="justify"
                  />
                  <CardContent>
                    {submitted === undefined ? (
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            name="name"
                            inputRef={register({ required: true })}
                            error={Boolean(errors.name)}
                            helperText={
                              Boolean(errors.name) &&
                              "Sie m??ssen einen Namen eingeben"
                            }
                            id="name"
                            label="Name"
                            variant="filled"
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            name="email"
                            inputRef={register({
                              required: true,
                              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            })}
                            error={Boolean(errors.email)}
                            helperText={
                              Boolean(errors.email) &&
                              "Sie m??ssen eine E-Mail eingeben"
                            }
                            id="email"
                            label="E-Mail"
                            variant="filled"
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <DcpPhoneInput />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            name="emailText"
                            inputRef={register({ required: true })}
                            error={Boolean(errors.emailText)}
                            helperText={
                              Boolean(errors.emailText) &&
                              "Sie m??ssen einen E-Mail-Text eingeben"
                            }
                            id="email-text"
                            label="E-Mail-Text"
                            multiline
                            minRows={10}
                            maxRows={20}
                            variant="filled"
                            fullWidth
                            required
                          />
                        </Grid>
                      </Grid>
                    ) : submitted === true ? (
                      <Alert severity="success">
                        Ihre Nachricht wurde erfolgreich gesendet! Vielen Dank
                        f??r Ihre Anfrage. Wir werden uns umgehend bei Ihnen
                        melden.
                      </Alert>
                    ) : (
                      <Alert severity="error">
                        Ihre Nachricht konnte nicht gesendet werden! Bitte
                        versuchen Sie es entweder zu einem sp??teren Zeitpunkt
                        noch einmal oder telefonisch.
                      </Alert>
                    )}
                  </CardContent>
                  {submitted === undefined ? (
                    <CardActions
                      sx={{
                        p: 2,
                        pt: 0,
                      }}
                    >
                      <LoadingButton
                        disabled={!isValid}
                        loading={isSubmitting}
                        type="submit"
                        variant="contained"
                        size="large"
                      >
                        Anfrage senden
                      </LoadingButton>
                    </CardActions>
                  ) : null}
                </Card>
              </Box>
            </FormProvider>
          </Element>
        </Container>
      </Element>
      <Box
        sx={{
          flexGrow: 1,
          mt: 4,
          boxShadow: "0px -5px 5px rgba(11, 0, 93, 0.3)",
        }}
      >
        <AppBar position="static">
          <StyledToolbar>
            <Grid container spacing={2} sx={{ pt: matchSmall ? 1 : 3, ml: 0 }}>
              <Grid
                item
                xs={12}
                sm={4}
                sx={
                  !matchSmall
                    ? { borderRight: "1px solid rgba(255, 255, 255, 0.4)" }
                    : {}
                }
              >
                <Typography align="center" sx={{ pt: matchSmall ? 1 : 0 }}>
                  <Link
                    style={{
                      color: "inherit",
                      textDecoration: "inherit",
                      fontWeight: "bold",
                    }}
                    to="/"
                    onClick={() => {
                      handleChange("section_1");
                    }}
                  >
                    {process.env.REACT_APP_SITE_NAME}
                  </Link>
                </Typography>
                <Typography
                  variant="caption"
                  component="p"
                  align="center"
                  sx={{ pb: 2, fontWeight: "light" }}
                >
                  {process.env.REACT_APP_SITE_HERO_TITLE_PART_2}
                </Typography>
                <Typography
                  variant="overline"
                  component="p"
                  align="center"
                  sx={{ fontWeight: "bold", lineHeight: 1.3 }}
                >
                  Telefon:
                </Typography>
                <Typography
                  align="center"
                  sx={{
                    pb: matchSmall ? 3 : 2,
                    fontWeight: "light",
                    borderBottom: matchSmall
                      ? "1px solid rgba(255, 255, 255, 0.4)"
                      : "",
                  }}
                >
                  <Obfuscate
                    style={{ color: "inherit", textDecoration: "inherit" }}
                    tel={process.env.REACT_APP_OWNER_TEL}
                  />
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                sx={
                  !matchSmall
                    ? { borderRight: "1px solid rgba(255, 255, 255, 0.4)" }
                    : {}
                }
              >
                <Typography
                  variant="overline"
                  component="p"
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    lineHeight: 1.3,
                    pt: matchSmall ? 1 : 0,
                  }}
                >
                  Inhaber:
                </Typography>
                <Typography align="center" sx={{ pb: 2, fontWeight: "light" }}>
                  {process.env.REACT_APP_OWNER_NAME}
                </Typography>
                <Typography
                  variant="overline"
                  component="p"
                  align="center"
                  sx={{ fontWeight: "bold", lineHeight: 1.3 }}
                >
                  Handwerkskammer <br />
                  Betriebsnummer:
                </Typography>
                <Typography
                  component="p"
                  align="center"
                  sx={{
                    pb: matchSmall ? 3 : 2,
                    fontWeight: "light",
                    borderBottom: matchSmall
                      ? "1px solid rgba(255, 255, 255, 0.4)"
                      : "",
                  }}
                >
                  {process.env.REACT_APP_OWNER_HWK}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="overline"
                  component="p"
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    lineHeight: 1.3,
                    pt: matchSmall ? 1 : 0,
                  }}
                >
                  Anschrift:
                </Typography>
                <Typography align="center" sx={{ fontWeight: "light" }}>
                  {process.env.REACT_APP_OWNER_ADRESS_STREET}
                </Typography>
                <Typography align="center" sx={{ pb: 2, fontWeight: "light" }}>
                  {process.env.REACT_APP_OWNER_ADRESS_ZIP_CITY}
                </Typography>
                <Typography
                  variant="overline"
                  component="p"
                  align="center"
                  sx={{ fontWeight: "bold", lineHeight: 1.3 }}
                >
                  E-Mail:
                </Typography>
                <Typography
                  align="center"
                  sx={{
                    pb: matchSmall ? 3 : 2,
                    fontWeight: "light",
                    borderBottom: matchSmall
                      ? "1px solid rgba(255, 255, 255, 0.4)"
                      : "",
                  }}
                >
                  <Obfuscate
                    style={{ color: "inherit", textDecoration: "inherit" }}
                    email={process.env.REACT_APP_OWNER_MAIL}
                    headers={{
                      subject: "Nachricht von Webseite",
                      body: "Sehr geehrte Damen und Herren,",
                    }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography
                  variant="caption"
                  component={Link}
                  sx={{ mt: 3, mb: 0, mr: 1 }}
                  style={{ color: "inherit", textDecoration: "inherit" }}
                  to="/impressum"
                >
                  Impressum
                </Typography>
                {" - "}
                <Typography
                  variant="caption"
                  component={Link}
                  sx={{ ml: 1, mt: 3, mb: 0 }}
                  style={{ color: "inherit", textDecoration: "inherit" }}
                  to="/datenschutz"
                >
                  Datenschutz
                </Typography>
                <Typography
                  variant="caption"
                  component="div"
                  sx={{ mt: 1, mb: 2 }}
                >
                  {"Copyright ?? "}
                  {new Date().getFullYear()}{" "}
                  <Link
                    style={{ color: "inherit", textDecoration: "inherit" }}
                    to="/"
                    onClick={() => handleChange("section_1")}
                  >
                    {process.env.REACT_APP_SITE_NAME}
                  </Link>
                  . Alle Rechte vorbehalten.
                </Typography>
              </Grid>
            </Grid>
          </StyledToolbar>
        </AppBar>
      </Box>
    </>
  );
}
